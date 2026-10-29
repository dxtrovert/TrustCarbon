# TrustCarbon

TrustCarbon is a web-based carbon emissions analysis and corporate disclosure platform. It brings historical emissions records, geographic insights and user-reviewed corporate disclosures into an interactive dashboard.

## Project team

**Group Number: 39**

- Jainam Bhavsar
- Adil Khan
- Aditya Chavan

The project abstract is available at `output/pdf/TrustCarbon_Abstract_Group_39.pdf`.

## Features

- Country emissions exploration, historical trend charts, rankings and comparisons.
- Indian state and union territory exploration with Climate TRACE estimates from 2021 onward.
- Sector comparisons and named-facility emissions estimates with source attribution.
- Carbon Time Machine with year selection, playback, baseline comparisons and country rankings.
- Statistical anomaly screening and transparent source-assessment rubrics.
- User-defined emissions reduction scenarios based on historical values.
- Company Monitor with user-confirmed BRSR metrics, source citations and recommendations.
- Local BRSR PDF text extraction with page-level evidence and reporting-column review.
- Configurable in-app threshold rules with evidence-backed alert history.
- Corporate report downloads in HTML and browser printing to PDF.
- Benchmark comparisons and restoration-area scenarios using user-entered assumptions.
- Supabase authentication, personal activity tracking and private dataset submission/review.

## Technology stack

- React 19, React Router 7 and Vite 8
- Recharts for interactive visualizations
- Supabase Auth, PostgreSQL and Storage
- PDF.js for local document text extraction
- Oxlint and Vitest for development checks

## Project structure

```text
src/
  analysis/       Framework-independent calculations and analysis fixtures
  components/     Shared UI, charts, maps and corporate interfaces
  contexts/       Authentication, dashboard and corporate state
  data/           Bundled datasets and geographic mappings
  hooks/          Shared React hooks
  pages/          Route-level dashboard screens
  services/       Source integrations, reporting and Supabase operations
  styles/         Shared styling
  utils/          Parsing, formatting and validation
public/           Static assets and supporting data
supabase/
  migrations/     Database schema and access policies
output/pdf/       Project abstract
```

## Setup

Use Node.js 20.19+ or 22.12+ and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the local environment file using your Supabase project settings.

Apply these migrations in order through the Supabase SQL Editor:

1. `supabase/migrations/20261008000000_initial_schema.sql`
2. `supabase/migrations/20261028000000_alert_rules.sql`
3. `supabase/migrations/20261029000000_activity_delete.sql`

The first migration sets up profiles, activities, datasets and private Storage access. The second adds user-owned alert rules and events, ownership policies, company indexes and duplicate-event protection.

```powershell
npm run build
npm run preview
```

Development commands include `npm run lint` and `npm test`.

## Data and analysis

Our World in Data supplies country-level historical CO2 observations. Climate TRACE supplies source-labelled sector, facility and Indian state emissions estimates. The country explorer also supports a labelled bundled CSV fallback. Source and reporting-period information accompany the views.

Time Machine presents historical observations with selected-year values, previous-observation changes, baseline differences and cumulative net change. Annual comparisons use consecutive years. Gaps retain their unavailable status, preserving the source record. Cumulative net change sums annual differences across a complete baseline-to-selection period.

Source assessments use a transparent TrustCarbon rubric: source credibility 25%, coverage 20%, completeness 20%, freshness 15% and validation 20%. Assigned credibility values are displayed alongside the scores. Corporate pressure scores use a weighted mean of the available dimensions.

## Corporate workflow

1. Choose a company and reporting year.
2. Select a local BRSR PDF and review its extracted text candidates.
3. Confirm the appropriate metric, page and reporting column.
4. Explore disclosures, recommendations and user-configured benchmarks.
5. Create threshold rules using the metric's exact reporting unit.
6. Review triggered events and their supporting evidence.
7. Download a source-labelled HTML report or choose Save as PDF through the browser print dialog.

Corporate documents and extracted metrics are held in browser-session state. Signed-in users can save private threshold rules and event citations through Supabase. Guest access supports session-held rules and history. Threshold evaluation takes place as company data or rules are loaded and updated. Confirmed source rows, matching reporting periods and compatible units determine which metrics qualify for evaluation.

Company disclosures, facility estimates, calculated subtotals, historical observations and user-defined scenarios retain distinct labels. The restoration scenario uses entered land area and planting density to estimate a tree count. The optional email tool prepares a draft for the recipient entered by the user.

## Account and dataset workflows

Supabase coordinates account sessions and role-protected routes. Users can record personal carbon activities and submit CSV datasets for administrative review. Row-level security applies ownership rules to private records, including alert rules and history. Dataset downloads use private Storage paths and signed access links.

CSV submissions use a location column (`Country`, `State`, `Region` or `Industry`) together with `Year,CO2_Emissions,Unit,Source`. The upload interface provides validation and template guidance.

## Source attribution

- Our World in Data: historical country CO2 and per-capita records.
- Climate TRACE: sector, named-source and India admin-level emissions estimates.
- User-supplied BRSR documents: confirmed corporate disclosures with page and reporting-column citations.
- Highcharts/OpenStreetMap: India admin-1 boundary geometry and geographic attribution.
- Bundled country CSV and labelled industry demonstration data: supporting exploration datasets.

## Git workflow

Use focused commits with messages in the form `type: short description`. The project uses `develop` for integration and `main` for stable releases. Local environment files, dependencies and generated build output are covered by `.gitignore`.

## Phase IV evaluation pack

Run `npm run verify:phase4` and then `npm run docs:phase4`. Open `output/phase4/PRESENTATION.html` for the 10-slide browser presentation (arrow keys; N for speaker notes), `REPORT.html` for the printable report, and `DEMO_GUIDE.html` for the timed demonstration. The report can be saved as PDF using the browser print dialog.

`output/phase4/TESTING.html` lists live acceptance checks and expected outcomes. Complete those against your configured Supabase project; automated service tests use mocks. Apply the activity-delete migration before demonstrating deletion. The Connection Checks screen is at `/data/system`.


