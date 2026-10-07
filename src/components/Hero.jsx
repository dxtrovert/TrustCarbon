import React, { useState } from 'react';
import { TOTAL_COUNTRIES, TOTAL_REGIONS, LATEST_YEAR, EARLIEST_YEAR } from '../data/realData';

export default function Hero({ onGlobalDataClick, onPersonalClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-arrow" aria-hidden="true">→</span>
          Real Data. Real Emissions. Real Insight.
        </p>

        <h1>Turn Carbon Data<br />Into <span>Action.</span></h1>

        <p className="hero-lede">
          Explore {TOTAL_COUNTRIES} countries across {TOTAL_REGIONS} regions
          with historical emissions from {EARLIEST_YEAR} to {LATEST_YEAR}.
          Built on real CSV data — no estimates, no projections.
        </p>

        <div className="hero-buttons">
          <button onClick={onGlobalDataClick} className="btn btn-primary">
            Explore Global Data
          </button>
          <button onClick={onPersonalClick} className="btn btn-secondary">
            Personal Carbon Tracker
          </button>
        </div>

        <p className="hero-micro">Analyze Data. Act Faster. Create Impact.</p>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>

        <div className="earth">
          {!imgError && (
            <img
              src="/earth.png"
              alt="Earth from space"
              style={{ display: imgLoaded ? 'block' : 'none' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}
          {(!imgLoaded || imgError) && (
            <div className="earth-globe" aria-hidden="true"></div>
          )}
          <span className="earth-ring"></span>
        </div>

        {/* Data chips with real values */}
        <div className="data-chip chip-co2">
          <span className="chip-label">COUNTRIES</span>
          <span className="chip-value">{TOTAL_COUNTRIES}</span>
        </div>
        <div className="data-chip chip-regions">
          <span className="chip-label">REGIONS</span>
          <span className="chip-value">{TOTAL_REGIONS}</span>
        </div>
        <div className="data-chip chip-emissions">
          <span className="chip-label">DATA SINCE</span>
          <span className="chip-value">{EARLIEST_YEAR}</span>
        </div>
        <div className="data-chip chip-data">
          <span className="chip-label">LATEST</span>
          <span className="chip-value">{LATEST_YEAR}</span>
        </div>
      </div>
    </section>
  );
}
