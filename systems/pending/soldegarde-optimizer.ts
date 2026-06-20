import {
  SiteConfig,
  DayData,
  StepResult,
  CleaningDecision,
  CleaningEvent,
  DEGRADATION_RATES,
} from '../types';

export interface SoilingState {
  currentSoilingPct: number;
  lastCleaningDate: Date | null;
  totalRevenueLost: number;
  cleaningEvents: CleaningEvent[];
  history: StepResult[];
}

export function createInitialState(): SoilingState {
  return {
    currentSoilingPct: 0.5,
    lastCleaningDate: null,
    totalRevenueLost: 0,
    cleaningEvents: [],
    history: [],
  };
}

/**
 * Compute daily soiling rate from PM2.5, PM10, pollen, and humidity.
 * Continuous log-linear model (no discrete buckets).
 */
export function computeSoilingRate(
  pm25: number,
  pm10: number | null,
  pollen: { grass: number | null; birch: number | null; ragweed: number | null } | null,
  humidity: number,
): number {
  // Base from fine particles (PM2.5)
  let rate = 0.05 * Math.log(Math.max(pm25, 0.1) + 1);

  // Coarse particles (PM10 - dust, sand) — adds on top of PM2.5
  if (pm10 !== null && pm10 > pm25) {
    const coarse = pm10 - pm25;
    rate += 0.02 * Math.log(Math.max(coarse, 0.1) + 1);
  }

  // Pollen — sticky, binds particles to glass
  if (pollen) {
    const totalPollen = (pollen.grass ?? 0) + (pollen.birch ?? 0) + (pollen.ragweed ?? 0);
    if (totalPollen > 0) {
      rate += 0.03 * Math.log(totalPollen + 1);
    }
  }

  // Humidity — binds particles to surface
  rate += 0.02 * (humidity / 100);

  return Math.min(Math.max(rate, 0.02), 1.5);
}

/**
 * Compute cleaning efficiency from rainfall, intensity, and duration.
 * - Light drizzle (< 1mm/hr): moderate cleaning (soaks & loosens)
 * - Moderate (2-5mm/hr): optimal cleaning
 * - Heavy (> 10mm/hr): good but some runoff waste
 * - Duration: longer exposure = better cleaning
 * 15mm threshold — below this, rain is ineffective.
 */
export function computeRainCleaning(
  dailyRainfall_mm: number,
  intensity_mmPerHr: number,
  pm25: number,
): { cleaningEfficiency: number; residualSoiling: number } {
  if (dailyRainfall_mm < 15) {
    return { cleaningEfficiency: 0, residualSoiling: 0 };
  }

  // Base efficiency from total rainfall (exponential saturation)
  let baseEff = 1 - Math.exp(-0.1 * (dailyRainfall_mm - 15));

  // Intensity factor: optimal at 2-5mm/hr, worse at extremes
  let intensityFactor = 1.0;
  if (intensity_mmPerHr > 0) {
    if (intensity_mmPerHr < 1) {
      intensityFactor = 0.6 + intensity_mmPerHr * 0.4; // light drizzle: 0.6-1.0
    } else if (intensity_mmPerHr <= 5) {
      intensityFactor = 1.0; // optimal
    } else if (intensity_mmPerHr <= 10) {
      intensityFactor = 1.0 - (intensity_mmPerHr - 5) * 0.04; // 1.0 → 0.8
    } else {
      intensityFactor = 0.7; // heavy downpour: runoff reduces effectiveness
    }
  }

  // Duration bonus: more hours = better (capped at 12h)
  const estimatedHours = intensity_mmPerHr > 0 ? dailyRainfall_mm / intensity_mmPerHr : 6;
  const durationFactor = Math.min(1.2, 0.7 + estimatedHours * 0.05);

  const cleaningEfficiency = Math.min(0.98, baseEff * intensityFactor * durationFactor);
  const residualSoiling = 0.5 * (1 + pm25 / 100);
  return { cleaningEfficiency, residualSoiling };
}

/**
 * Compute age-based degradation for a given panel type.
 */
export function computeAgeEfficiency(panelType: PanelType, ageYears: number): number {
  const rate = DEGRADATION_RATES[panelType] ?? 0.004;
  return Math.max(1 - rate * ageYears, 0.6);
}

/**
 * Run one day step of the soiling optimizer.
 */
export function stepOptimizer(state: SoilingState, config: SiteConfig, day: DayData): StepResult {
  // 1. Soiling accumulation
  const rate = computeSoilingRate(day.pm25, day.pm10, day.pollen, day.humidity);
  let soilingPct = Math.min(30, state.currentSoilingPct + rate);

  // 2. Rain cleaning
  const rain = computeRainCleaning(day.dailyRainfall_mm, day.intensity_mmPerHr, day.pm25);
  if (rain.cleaningEfficiency > 0) {
    soilingPct = Math.max(soilingPct * (1 - rain.cleaningEfficiency), rain.residualSoiling);
  }

  state.currentSoilingPct = soilingPct;

  // 3. Power output
  const ageEfficiency = computeAgeEfficiency(config.panelType, config.age_years);
  const soilingEfficiency = 1 - soilingPct / 100;
  const outputKw = config.capacity_kW * config.moduleEfficiency * ageEfficiency * soilingEfficiency;

  // 4. Revenue loss
  const theoreticalOutput = config.capacity_kW * config.moduleEfficiency * ageEfficiency;
  const dailyLoss = Math.max(0, (theoreticalOutput - outputKw) * day.peakSunHours * day.energyPrice);
  state.totalRevenueLost += dailyLoss;

  const result: StepResult = { outputKw, soilingPct, dailyLoss, ageEfficiency, soilingEfficiency };
  state.history.push(result);
  return result;
}

/**
 * Run optimizer over an array of days (e.g. 14 days of history).
 */
export function runHistoricalOptimizer(config: SiteConfig, days: DayData[]): SoilingState {
  const state = createInitialState();
  for (const day of days) {
    stepOptimizer(state, config, day);
  }
  return state;
}

/**
 * Generate cleaning recommendation based on current state + forecast.
 */
export function getCleaningRecommendation(
  state: SoilingState,
  config: SiteConfig,
  rainForecastDays: number | null,
  forecastRainfall_mm: number,
  averageDailyRate: number,
): CleaningDecision {
  // Project forward 30 days
  const projectedSoiling = Math.min(30, state.currentSoilingPct + averageDailyRate * 30);
  const avgSoiling = (state.currentSoilingPct + projectedSoiling) / 2;
  const lossOver30Days =
    config.capacity_kW *
    config.moduleEfficiency *
    (avgSoiling / 100) *
    config.peakSunHours *
    30 *
    // Use a reasonable default energy price if not available
    0.15;

  // Rain postponement
  if (rainForecastDays !== null && rainForecastDays <= 7 && forecastRainfall_mm >= 15) {
    return {
      shouldClean: false,
      revenueGain30Days: Math.round(lossOver30Days * 100) / 100,
      reasoning: `Rain expected in ${rainForecastDays} day${rainForecastDays > 1 ? 's' : ''} — natural cleaning likely. Hold off.`,
    };
  }

  const shouldClean = lossOver30Days > config.cleaningCost;

  return {
    shouldClean,
    revenueGain30Days: Math.round(lossOver30Days * 100) / 100,
    reasoning: shouldClean
      ? `Cleaning saves $${Math.round(lossOver30Days)} over 30 days vs $${config.cleaningCost} cost — recommended.`
      : `30-day loss of $${Math.round(lossOver30Days)} doesn't justify $${config.cleaningCost} cleaning cost — monitoring.`,
  };
}
