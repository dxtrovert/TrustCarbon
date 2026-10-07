# TrustCarbon

TrustCarbon is a climate data publication and emissions analytics portal. It presents country and regional emissions records, an Indian state map, sector demo charts, source notes, personal activity tracking, and private dataset review.
## Features and modules

- Country and regional emissions exploration, comparisons, and historical trends.
- India state and union territory map joined through ISO identifiers.
- Industry comparison and trend views using explicitly illustrative demo data.
- Searchable data tables, source documentation, and methodology notes.
- Supabase Auth accounts with persistent sessions and role-protected user/admin routes.
- Private personal activity tracking and manual review for uploaded CSV datasets.
- Data summaries and source information alongside the visualizations.
- Reusable components, backend services, static data, utilities, and geographic boundaries organized by responsibility.

Supabase handles authentication, PostgreSQL data, and private dataset file storage. The bundled country and regional emissions datasets remain static frontend data and are not uploaded to Supabase.

## Technology stack

- React 19 and React Router 7
- Vite 8 for development and production builds
- Supabase Auth, PostgreSQL, and Storage via `@supabase/supabase-js`
- Recharts for data visualization
- Oxlint for static analysis

## Project structure

```text
public/                     Static assets served by Vite
  assets/                   Fingerprint logo and India boundary GeoJSON
  data/                     Industry demo CSV
src/
  components/
    charts/                 Emissions, regional, comparison charts and chart shell
    datasets/               Dataset submission interface
    layout/                 Navigation and footer
    maps/                   India state map and map-specific rendering
    ui/                     Shared form controls, headings, and KPI primitives
  config/                   Supabase client and environment configuration
  contexts/                 Authentication provider and shared auth context
  data/                     Source CSVs, static datasets, and derived data
  hooks/                    React hooks, including useAuth
  pages/                    Route-level screens
  services/                 Auth, activity, dataset, and admin review operations
  styles/                   Shared global styles
  utils/                    CSV parsing, validation, and formatting
  App.jsx                   Routes and application shell
  main.jsx                  Frontend entry point
supabase/
  migrations/               PostgreSQL schema, RLS, and Storage policies
scripts/                     Legacy standalone dataset/transcript utilities
```

Pages stay as separate route-level modules in `src/pages/`. The application shell wires routes; components are grouped by their role. Supabase queries remain in `src/services/`, reusable CSV parsing and validation live in `src/utils/`, and static source datasets remain in `src/data/` or `public/data/`. Scripts are standalone utilities, not runtime modules.

The India map uses the 36-feature Highcharts India admin-1 GeoJSON boundary layer based on OpenStreetMap. Its state and union territory features are joined by their `iso3166-2` identifiers, not by display labels, and the geometries are projected using an Albers equal-area conic projection. Jammu and Kashmir and Ladakh remain separate features from the source. Map attribution is © Highsoft and [OpenStreetMap contributors](https://openstreetmap.org/copyright). This is only a geographic outline layer. Emissions values come from the existing CarbonEmissionIndia data, and states without a matching value are shown as unavailable.

## Setup and execution

Requirements: Node.js 20.19+ or 22.12+ and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Set the following values in `.env.local` from your Supabase project settings (the publishable key is safe for browser use; never put a service-role key in the frontend):

Vite loads `.env.local` from the project root; it does not load `.env.example`.

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Run `supabase/migrations/20261008000000_initial_schema.sql` in the Supabase Dashboard SQL Editor. This creates the `profiles`, `activities`, and `datasets` tables, their constraints and indexes, row-level security policies, and the private `trustcarbon-datasets` Storage bucket. If using the Supabase CLI, initialize and link the project first, then apply the migration with `supabase db push`. `profiles` rows are created automatically when an Auth user signs up; users cannot set or change their own role.

To designate an administrator, first create the account through the app, then run this as a trusted project owner in the Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

The `datasets.file_url` field stores a private Storage object path, not a public URL. Downloads use short-lived signed URLs after Storage RLS verifies ownership or admin access. Submitted files remain pending and are never added to the public static datasets automatically.

Open the local URL printed by Vite. For a production build and local preview:

```bash
npm run build
npm run preview
```

Run static analysis with `npm run lint`. There is currently no automated test script.

## Authentication and data workflows

- Signup, login, logout, persistent sessions, profile roles, and protected routes are coordinated by `src/contexts/AuthContext.jsx` and `src/hooks/useAuth.js`; Supabase operations are in `src/services/authService.js`.
- Users can create personal carbon activities through `src/services/activityService.js`.
- CSV submissions are validated before upload, stored in the private Supabase Storage bucket, and recorded with `pending` status. The uploader can see their own submissions; DBAs review them through the admin screen.
- Rejected submissions require a review reason. Pending and rejected files remain private. Approval makes a submission eligible for a separate publication decision, but does not automatically publish or merge it into static public datasets.
- RLS and Storage policies in the migration enforce access independently from frontend route checks.

CSV submissions use one location column plus `Year,CO2_Emissions,Unit,Source`. The location column is `Country`, `State`, `Region`, or `Industry`, depending on the selected dataset type. Use the in-app template and validation feedback before submitting.

The industry demo data is located at `public/data/industry_demo.csv`. Its source is `Illustrative demo dataset`. Values are not verified real-world measurements and must not be represented as official TrustCarbon data.

### Backend smoke test

Use a configured Supabase project and the local app to exercise the end-to-end workflows:

1. Create a normal account, confirm its email if email confirmation is enabled, log in, refresh the page, and verify the session remains active. Log out and verify `/dashboard` redirects to login.
2. Log in as a normal user, add an activity, refresh the dashboard, and verify its totals and recent activity. Upload a CSV and verify its submission is `pending` and downloadable only while signed in as its owner.
3. Promote a second account to admin using the SQL above. Log in as that account, open `/admin`, download a pending CSV, approve one submission and reject another with a reason. Verify review status, reviewer, and timestamp in `public.datasets`.
4. Verify the normal user cannot open `/admin`, review a dataset, read another user's activity, or update `profiles.role`. RLS protects these operations even when requests are made outside the app.



