# TrustCarbon

TrustCarbon is a carbon-emissions analytics dashboard for exploring country-level emissions trends and comparing per-capita emissions across Indian states. It turns the supplied datasets into interactive charts, tables, and summary metrics.
## Features and modules

- Country and regional emissions exploration, comparisons, and historical trends.
- Indian state-level per-capita emissions visualization.
- Dashboard and personal-footprint demo views, with login state stored locally in the browser.
- Data summaries and source information alongside the visualizations.
- Data-processing utilities in `scripts/` and shared application data/transformations in `src/data/`.

The current application is a frontend-only demo. It does not include a backend service or remote API; login is not production authentication.

## Technology stack

- React 19 and React Router 7
- Vite 8 for development and production builds
- Recharts for data visualization
- Oxlint for static analysis

## Project structure

```text
public/          Static assets served by Vite
scripts/         Dataset extraction and conversion utilities
src/
	assets/        Imported frontend assets
	components/    Reusable charts, navigation, tables, and UI components
	data/          Source CSVs, derived datasets, and data access/transforms
	pages/         Route-level screens
	styles/        Shared global styles
	utils/         Shared formatting helpers
	App.jsx        Routes and application-level login state
	main.jsx       Frontend entry point
index.html       Vite HTML entry point
vite.config.js   Vite configuration
```

There is no separate backend module because this project currently has no backend. The `scripts/` utilities are separate from the runtime application and are not needed to start it.

## Setup and execution

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production build and local preview:

```bash
npm run build
npm run preview
```

Run static analysis with `npm run lint`. There is currently no automated test script.

## Data sources

The checked-in files under `src/data/` include country-level CO₂ emissions (`Carbon_(CO2)_Emissions_by_Country.csv`, 1990–2019) and India state-level per-capita emissions (`rawIndiaData.csv`, a single-period snapshot), along with derived JavaScript datasets and transformations in `realData.js`. The application also contains demo/sample values in `mockData.js`. Source labels and coverage are displayed in the application; consult the dataset files and their original provider documentation for licensing, methodology, and attribution before redistribution or production use.

The scripts in `scripts/` are legacy transcript/dataset extraction utilities. Some expect a transcript at a machine-specific local path, so they are not part of the clean-install application workflow.

## Git workflow

- `main` contains stable, demonstration-ready code.
- `develop` is the integration branch for ongoing work.
- Create focused branches from `develop` using `feature/<name>`, `fix/<name>`, or `docs/<name>`, then merge reviewed work back into `develop`. Promote verified releases from `develop` to `main`.
- Use Conventional Commit-style messages with a type and concise imperative summary, for example `feat: add dataset processing module`, `fix: resolve dashboard loading issue`, `refactor: organize data utilities`, and `docs: update project documentation`.
- Keep commits focused on a meaningful change; do not commit generated build output, dependencies, or local archives.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
