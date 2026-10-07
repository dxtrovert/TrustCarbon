import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import KpiGrid from '../components/KpiGrid';
import KpiCard from '../components/KpiCard';
import EmissionsTrend from '../components/EmissionsTrend';
import RegionalChart from '../components/RegionalChart';
import CountryExplorer from '../components/CountryExplorer';
import IndiaStateChart from '../components/IndiaStateChart';
import DataTable from '../components/DataTable';
import DataSources from '../components/DataSources';
import PersonalTracker from '../components/PersonalTracker';

// Real data
import {
  KPI_DATA,
  EMISSIONS_TREND,
  REGIONAL_DATA,
  TABLE_DATA,
} from '../data/realData';

export default function Home({ isLoggedIn }) {
  const globalDataRef = useRef(null);
  const personalRef = useRef(null);
  const navigate = useNavigate();

  const scrollToGlobalData = () => {
    globalDataRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToPersonal = () => {
    personalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <Hero
        onGlobalDataClick={scrollToGlobalData}
        onPersonalClick={scrollToPersonal}
      />

      {/* ─── 2. GLOBAL CARBON DATA ───────────────────────────────────────── */}
      <section
        className="industrial-section"
        id="global-carbon-data"
        ref={globalDataRef}
        style={{ scrollMarginTop: '100px' }}
      >
        <SectionHeading
          title="Global Carbon Data"
          subtitle="Numbers derived directly from the Country CO₂ Emissions dataset. No estimates or projections."
        />

        <KpiGrid>
          <KpiCard
            title="Total Countries"
            value={KPI_DATA.totalCountries.value}
            desc={KPI_DATA.totalCountries.desc}
          />
          <KpiCard
            title="Regions"
            value={KPI_DATA.totalRegions.value}
            desc={KPI_DATA.totalRegions.desc}
          />
          <KpiCard
            title="Latest Data Year"
            value={KPI_DATA.latestDataYear.value}
            desc={KPI_DATA.latestDataYear.desc}
          />
          <KpiCard
            title="Avg Per Capita"
            value={KPI_DATA.avgPerCapita.value}
            desc={KPI_DATA.avgPerCapita.desc}
          />
        </KpiGrid>

        {/* Global trend chart */}
        <div style={{ marginBottom: '32px' }}>
          <EmissionsTrend data={EMISSIONS_TREND} />
        </div>
      </section>

      {/* ─── 3. REGIONAL ANALYSIS ────────────────────────────────────────── */}
      <section
        className="industrial-section"
        id="regional-analysis"
        style={{ scrollMarginTop: '100px', paddingTop: '0' }}
      >
        <SectionHeading
          title="Regional Analysis"
          subtitle="Compare emissions across regions. Use the year filter to explore any year from 1990 to 2019."
        />
        <div style={{ marginBottom: '32px' }}>
          <RegionalChart data={REGIONAL_DATA} />
        </div>
      </section>

      {/* ─── 4. COUNTRY EXPLORER ─────────────────────────────────────────── */}
      <section
        className="industrial-section"
        id="country-explorer"
        style={{ scrollMarginTop: '100px', paddingTop: '0' }}
      >
        <SectionHeading
          title="Country Explorer"
          subtitle="Search any country from the dataset to see its CO₂ history, total emissions, and per-capita figures."
        />
        <CountryExplorer />
      </section>

      {/* ─── 5. INDIA STATE CARBON DATA ──────────────────────────────────── */}
      <section
        className="industrial-section"
        id="india-states"
        style={{ scrollMarginTop: '100px', paddingTop: '0' }}
      >
        <SectionHeading
          title="India State Carbon Data"
          subtitle="Per-capita CO₂, CO and CH₄ emissions by Indian state from the CarbonEmissionIndia dataset."
        />
        <IndiaStateChart />
      </section>

      {/* ─── 6. DATA TABLE ───────────────────────────────────────────────── */}
      <section
        className="industrial-section"
        id="data-table"
        style={{ scrollMarginTop: '100px', paddingTop: '0' }}
      >
        <SectionHeading
          title="Carbon Data Table"
          subtitle="Full dataset — all countries, regions, years, CO₂ (in megatons), and per-capita values."
        />
        <DataTable data={TABLE_DATA} />
      </section>

      {/* ─── 7. DATA SOURCES ─────────────────────────────────────────────── */}
      <section
        className="industrial-section"
        id="data-sources"
        style={{ scrollMarginTop: '100px', paddingTop: '0' }}
      >
        <DataSources />
      </section>

      {/* ─── 8. PERSONAL TRACKER ─────────────────────────────────────────── */}
      <div
        ref={personalRef}
        id="personal-tracker"
        style={{ scrollMarginTop: '100px' }}
      >
        <PersonalTracker
          isLoggedIn={isLoggedIn}
          onLoginClick={() => navigate('/login')}
          onDashboardClick={() => navigate('/dashboard')}
          data={null}
        />
      </div>
    </div>
  );
}
