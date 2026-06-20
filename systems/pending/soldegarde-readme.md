# SolDegrade Optima ☀️⚔️

SolDegrade Optima is an advanced, enterprise-grade full-stack solar panel efficiency, soiling tracker, and maintenance scheduling optimizer. Designed for modern solar array operators, the platform combines live hyper-local particulate pollutant variables (PM2.5), localized dynamic grid energy prices, and meteorological forecasting to calculate the exact financial tipping point for solar panel cleaning. 

By utilizing **uncompromising diagnostic modeling**, the application analyzes real-time and historical panel performance, accounts for year-over-year operational degradation, and provides clear, actionable economic recommendations to maximize power grid yield and overall operational ROI.

---

## 🚀 Key Architectural Features

### 1. Smart Degradation & Soiling Optimizer
- **Multi-Factor Soiling Model**: Tracks panel soiling using **PM2.5** (fine particles), **PM10** (dust, sand), and **pollen** (grass, birch, ragweed) — all sourced from Open-Meteo's free air quality API.
- **Rain Cleaning with Intensity**: Models natural cleaning from rain, factoring in **total rainfall**, **intensity** (drizzle vs downpour), and **duration** — moderate rain over several hours cleans best.
- **Year-Over-Year Degradation**: Corrects per panel type (monocrystalline 0.4%/yr, polycrystalline 0.65%/yr, thin-film 1.2%/yr).
- **Dynamic Grid Arbitrage Integration**: Tracks dynamic local electricity tariff price indices ($/kWh) to evaluate real-time financial losses resulting from diminished performance.
- **Actionable ROI Recommendations**: Calculates the precise cost-benefit margins of initiating a cleaning cycle, considering contracted service flat rates and forecasted 30-day recuperable yields.

### 2. High-Fidelity Environmental Telemetry & Health Monitoring
- **Deep Status Telemetry Diagnostics**: Evaluates comprehensive electrical variables including grid input voltage fluctuations, string currents, frequency limits, and solar inverter casing temperatures.
- **Live Weather Alerts & Grounding**: Incorporates localized meteorological patterns and rain forecasting to dynamically postpone cleaning suggestions if natural rain cleaning is imminent.

### 3. Server-Side Gemini AI Commentary
- **Serverless Key Isolation**: Eliminates client-side credential exposure by routing sensitive model invocations through our custom Express server.
- **Tactical Analytics Advisor**: leverages the state-of-the-art `@google/genai` SDK on the backend to deliver professional, contextual, and dynamic operational guidelines explaining why critical cleaning parameters should be approved.

### 4. Zero-Friction Resilience (Serverless Simulation Auto-Recovery)
- **Automatic API Rate Limit Healing**: Employs deep local fallback simulators that seamlessly activate if third-party weather API thresholds are exceeded, ensuring zero disruption to live metric feeds or analytical pipelines.
- **Simultaneous Historical Rehydration**: Guarantees chart continuity by dynamically populating previous solar yield data points suited to regional solar capacities.

### 5. Multi-Core Google Drive Cloud Backup
- Provides an elegant, secure OAuth-driven background exporter compiling three critical administrative items directly into a custom `"SolDegrade Optima Backup"` root folder:
  1. `solar_settings_backup.json`: Active solar capacity configurations, physical efficiency coefficients, and operations meta logs.
  2. `solar_performance_history_<node>.csv`: Thorough ledger mapping timeseries output yields, particulate indexes, soiling variables, and cleaning event records.
  3. `solar_degradation_report.md`: A dynamically assembled markdown executive briefing outlining system performance margins and tactical recommendations.

---

## 🛠️ Stack Architecture

- **Frontend**: React 19 with TypeScript, [Tailwind CSS v4](https://tailwindcss.com/), [Recharts](https://recharts.org/) for charts.
- **Backend**: Express server (single process serves both API and frontend static files).
- **Data**: [Open-Meteo](https://open-meteo.com/) free APIs (air quality, weather, geocoding) — no API keys required.
- **AI**: [Google Gemini](https://ai.google.dev/) via `@google/genai` SDK — optional, paste key in Settings UI.
- **Settings**: Persisted in browser localStorage — no account, no database, no Firebase.

---

## 📂 Project Structure

```bash
├── server.ts                 # Express server (API + static file serving)
├── src/
│   ├── App.tsx               # Dashboard layout and state coordinator
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind styling
│   ├── types.ts              # TypeScript interfaces
│   ├── lib/
│   │   ├── optimizer.ts      # Core soiling accumulation, rain cleaning, ROI algorithm
│   │   ├── api.ts            # Fetch wrappers for backend endpoints
│   │   ├── storage.ts        # localStorage persistence
│   │   └── soilingStore.ts   # Cross-session soiling state persistence
│   └── components/
│       ├── SettingsPanel.tsx         # Location, panel type, API key config
│       ├── CleaningOptimizerCard.tsx # Cleaning recommendation with ROI
│       ├── EnvironmentalPanel.tsx    # PM2.5, PM10, pollen, energy price
│       ├── HealthMonitor.tsx         # Editable inverter telemetry sliders
│       ├── HistoryCharts.tsx         # Multi-axis Recharts performance trends
│       └── SolarStatsGrid.tsx        # Operational metrics overview
├── start.bat                # Windows double-click launcher
└── package.json
```

---

## ⚡ Setup & Local Development

### 1. Quick Start
```bash
git clone https://github.com/washingtoneimae-dot/soldegarde.git
cd soldegarde
npm install
npm run build
NODE_ENV=production node dist/server.cjs
# Opens at http://localhost:3001
```

### 2. Windows (Double-Click)
Just run `start.bat` — it handles everything: Node.js check, dependency install, build, and server launch.

### 3. Gemini AI (Optional)
The app works without it, but for AI commentary on cleaning decisions:
- Open Settings in the app
- Paste your free API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Click Save (key is sent to server, stored in memory for the session)

No `.env` file needed. No account required. All Open-Meteo data feeds work without API keys.

---
