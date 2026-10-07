import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-brand-link" aria-label="TrustCarbon home">
            <img className="footer-brand-logo" src="/assets/trustcarbon-fingerprint.png" alt="TrustCarbon logo" />
            <span className="brand-name">TrustCarbon</span>
          </Link>
          <span className="brand-tagline">Measure. Reduce. Sustain.</span>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/#global-carbon-data">Global Data</Link>
            <Link to="/#regional-analysis">Regional Analysis</Link>
            <Link to="/#country-explorer">Country Explorer</Link>
          </div>
          <div className="footer-col">
            <h4>Datasets</h4>
            <Link to="/#india-states">India State Data</Link>
            <Link to="/#data-table">Data Table</Link>
            <Link to="/#data-sources">Data Sources</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TrustCarbon. Data from Carbon (CO₂) Emissions by Country &amp; CarbonEmissionIndia datasets.</span>
      </div>
    </footer>
  );
}
