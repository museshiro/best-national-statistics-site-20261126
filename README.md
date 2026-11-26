# Indonesia in Numbers — National Statistics Explorer

[![Competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/museshiro/best-national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/museshiro/best-national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

[Make the best national statistics site — bounty page](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A working national statistics site for **Indonesia**, data vintage 2024, built as plain static files: 8 pages, 20+ hand-drawn SVG charts, 9 working offline controls, zero network requests. Every figure is sourced from BPS (Statistics Indonesia), Bank Indonesia, the World Bank, the IMF and the Ministry of Manpower.

## The site

- **Dashboard** (`app/index.html`) — 8 headline KPIs (GDP Rp22,139tn, growth 5.03%, population 281.6m, poverty 8.57% — lowest since 1960), growth line, sector donut, province bars, rupiah chart, year-in-focus table.
- **Economy** — nominal vs real GDP tabs, 13-sector breakdown, ten-year sortable table.
- **Trade** — exports US$264.7bn vs imports US$233.7bn, surplus US$31.0bn, top commodities (HS 2-digit) and partners, live search.
- **Population** — trend 2010–2024, largest provinces, island-group donut with Java-vs-rest tab.
- **Regions** — provincial GRDP, population-vs-GRDP scatter, UMP 2025 minimum wages (13 verified provinces).
- **Prices & Money** — monthly CPI inflation vs BI-Rate dual chart, reserves US$155.7bn, rupiah annual average Rp15,855.
- **Welfare** — HDI 75.02, poverty, Gini 0.379, unemployment 4.91%, decade table.
- **About & Sources** — data dictionary, verification notes, full site map.

## Controls (all work offline)

Year filter, tabs, sortable tables, live search with “showing N of M”, chart ↔ table toggle on every chart, hover tooltips, hash routing (`#tab=`, `#yr=`), dark/light theme saved on-device. All rendering is synchronous on `DOMContentLoaded`, so screenshots are deterministic.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` directly — no build step, no server required.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

`main.ts` copies `app/` and `screenshots/` to `/output` and builds `dossier.json` with the vendored `vendor/makefun-frontend.ts` (kit copy, unchanged).

## Verification notes

- Poverty September 2024 is **8.57%** (9.03% is March 2024 — the two are different surveys).
- UMP 2025 East Java Rp2,305,985; West Nusa Tenggara Rp2,602,931. The Highland Papua value could not be verified and is not shown.
- Rp15,855 is the 2024 **annual-average** rupiah per US dollar, not the end-year rate.
- Two charts were dropped rather than guessed (2024 sector growth rates, inflation by expenditure group).
