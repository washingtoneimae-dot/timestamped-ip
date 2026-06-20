# SACCO Member Statement System

**Author:** Washington Imae
**Date:** 2026-06-20
**Repo:** github.com/washingtoneimae-dot/saccosystem2

## Summary

A zero-dependency SACCO (Savings and Credit Cooperative) administration system that automates member management, transaction tracking, statement generation, and email delivery.

## Core Innovations

1. **Zero pip packages** — Entire system uses only Python stdlib. HTTP server, SQLite database, Excel generation (raw ZIP/XML), and email delivery (via Himalaya CLI) with no external Python dependencies.

2. **Auto-interest calculation** — Monthly compounding interest is computed automatically from outstanding loan balances. No manual `interest_charge` transactions needed. Rate configurable from dashboard (0-100%).

3. **Excel statements in Norken SACCO format** — Generates .xlsx files matching the exact format of Norken SACCO Society Limited, using raw ZIP/XML assembly (no openpyxl/xlsxwriter dependency).

4. **Windows-native one-click launch** — SACCO.bat auto-detects Python (py launcher or python.exe), auto-installs Himalaya CLI, and opens the dashboard — all via double-click.

5. **Evidence upload system** — Base64 PDF uploads attached to transactions, retrievable via download links in the dashboard.

6. **Self-seeding database** — Schema and default settings auto-created on first run. Fresh install works immediately with preset SACCO configuration.

## Architecture

```
Browser → api_server.py → sacco.db (SQLite)
              ├── compute.py       (running balances + auto-interest)
              ├── generate_xlsx.py (Norken-format Excel)
              ├── render.py        (HTML email body)
              └── dashboard_template.html + dashboard.js
```

Email delivery via Himalaya CLI → Gmail SMTP.

## Key Technical Decisions

- HTTP server: `http.server.ThreadingHTTPServer` (stdlib, no Flask/FastAPI)
- Database: SQLite with parameterized queries (no SQL injection)
- Excel: Raw ZIP/XML assembly (25KB generator, no heavy dependencies)
- Email: Shell out to Himalaya CLI (separation of concerns)
- Windows launcher: Batch script with port-based health checks (cross-locale safe)
- Line endings: CRLF enforced via .gitattributes (cmd.exe compatibility)

## API Surface

22 POST endpoints covering: member CRUD, transaction CRUD, statement generation, Excel export (ZIP), email delivery, settings management, evidence upload/download, and remote shutdown.
