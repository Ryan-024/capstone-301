# Content Analytics Dashboard

A single-page operational analytics dashboard for a content channel, built with Vue 3, TypeScript, Vuetify 3, and Chart.js. It visualizes 12 months of synthetic content-performance data (views, ad revenue, engagement, and audience demographics) across configurable time ranges.

## Features

- **Time-range filter** — Switch between 7, 30, 90, and 365-day windows; every card and chart re-aggregates instantly.
- **KPI cards** — Overall Views, Ad Revenue, and Net Subscribers with period-over-period change indicators (arrow + color).
- **Engagement chart** — Time-bucketed line chart with filters for All, Likes, Comments, and Shares.
- **Viewer chart** — Audience breakdown pivotable by Gender, Age, or Location.
- **Top 5 content lists** — Best-performing content by engagement score and by ad revenue.
- **Light / dark theme toggle** — Vuetify dark mode by default; theme choice is exposed from the app bar.
- **Responsive layout** — Uses `v-container` / `v-row` / `v-col` so cards and charts stack cleanly on small screens.

## Tech Stack

- [Vue 3](https://vuejs.org/) with `<script setup>` + TypeScript
- [Vuetify 3](https://vuetifyjs.com/) (Material Design components, theming)
- [Chart.js](https://www.chartjs.org/) via [vue-chartjs](https://vue-chartjs.org/)
- [Vite 6](https://vitejs.dev/) for dev server and build
- [`@mdi/font`](https://pictogrammers.com/library/mdi/) for icons

No backend or API — all data is loaded from a local JSON file.

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+ (or a compatible package manager)

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite will print a local URL (usually http://localhost:5173).

### Type-check and build for production

```bash
npm run build
```

Runs `vue-tsc -b` for a project-wide type check, then bundles with Vite into [dist/](dist/).

### Preview the production build

```bash
npm run preview
```

## Project Structure

```
index.html                     Vite entry
vite.config.ts                 Vite + Vuetify plugin config
tsconfig*.json                 TypeScript project references
src/
  main.ts                      App bootstrap (Vuetify + Chart.js registration)
  App.vue                      Page layout (KPI row, charts, top content)
  types.ts                     Dataset / content type definitions
  datametrics.json             Synthetic 2025 dataset (12 months)
  shims-vue.d.ts               .vue module shim
  components/
    AppHeader.vue              App bar, range filter, theme toggle
    RangeFilter.vue            7 / 30 / 90 / 365-day selector
    StatCard.vue               KPI card with trend indicator
    EngagementChart.vue        Likes / comments / shares over time
    ViewerChart.vue            Gender / age / location breakdown
    TopContent.vue             Top-5 list (engagement or revenue mode)
  composables/
    useDataset.ts              Range filtering + aggregation logic
    theme.ts                   Theme toggle + number/currency formatters
  plugins/
    vuetify.ts                 Vuetify instance + theme definitions
    chart.ts                   Chart.js component registration
```

## Data Model

Data lives in [src/datametrics.json](src/datametrics.json) and covers Jan–Dec 2025 for a single channel. It contains:

- **Channel** — name, starting and ending subscriber counts.
- **Months** — for each month, aggregate `totals` (views, unique views, subscriber views, ad revenue, new/lost/net subscribers, likes, comments, shares) plus the `content` published that month.
- **Content pieces** — id, title, publish date, duration, view breakdown (`unique`, `subscriber`, `total`, `avgWatchTimeSeconds`), `adRevenue`, `engagement` (likes/comments/shares), and `demographics` splits by gender, age, and location.

See [src/types.ts](src/types.ts) for full type definitions.

### Aggregation notes

- The dashboard anchors "now" to **2025-12-31** so range filters produce meaningful windows against the fixed dataset.
- Ad revenue is only produced for content that clears a total-views threshold (per [PLAN.md](PLAN.md)).
- Net subscribers for a window are scaled from monthly totals by that window's share of monthly unique views (see [`aggregate`](src/composables/useDataset.ts) in useDataset.ts).
- Engagement score for the "Top by Engagement" list weights comments and shares more heavily than likes: `likes + comments * 3 + shares * 5`.

## Design Notes

- **Dark-first** theme with a cohesive (non-rainbow) palette defined in [src/plugins/vuetify.ts](src/plugins/vuetify.ts).
- Layout keeps ample whitespace and uses Vuetify's 12-column grid so the three KPI cards collapse to a single column on mobile.
- All numeric display goes through `formatNumber` / `formatCurrency` helpers in [src/composables/theme.ts](src/composables/theme.ts) for consistent formatting.

## Roadmap / Ideas

- Persist the selected range and theme in `localStorage`.
- Add drill-down from a top-content row into a per-video detail view.
- Swap the static JSON for a real API once one is available.

## License

Private project — no license granted.
