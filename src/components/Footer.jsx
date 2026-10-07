import React from 'react';
import { Link } from 'react-router-dom';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="brand-name">TrustCarbon</span>
          <span className="brand-tagline">Measure. Reduce. Sustain.</span>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="#global-carbon-data" onClick={(e) => { e.preventDefault(); scrollTo('global-carbon-data'); }}>Global Data</a>
            <a href="#regional-analysis" onClick={(e) => { e.preventDefault(); scrollTo('regional-analysis'); }}>Regional Analysis</a>
            <a href="#country-explorer" onClick={(e) => { e.preventDefault(); scrollTo('country-explorer'); }}>Country Explorer</a>
          </div>
          <div className="footer-col">
            <h4>Datasets</h4>
            <a href="#india-states" onClick={(e) => { e.preventDefault(); scrollTo('india-states'); }}>India State Data</a>
            <a href="#data-table" onClick={(e) => { e.preventDefault(); scrollTo('data-table'); }}>Data Table</a>
            <a href="#data-sources" onClick={(e) => { e.preventDefault(); scrollTo('data-sources'); }}>Data Sources</a>
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
