import React from 'react';
import { DATA_SOURCES_INFO } from '../data/realData';

export default function DataSources() {
  return (
    <div className="sources-section">
      <div className="section-head" style={{ marginBottom: '32px' }}>
        <h2>Data Sources</h2>
        <p>
          TrustCarbon uses two real datasets. All numbers displayed on this page
          are calculated directly from these files — no estimates or projections.
        </p>
      </div>

      <div className="sources-grid">
        {DATA_SOURCES_INFO.map((source, idx) => (
          <div className="source-card" key={idx}>
            <h4>{source.name}</h4>
            <div className="source-details">
              <div className="source-detail">
                <span>Coverage</span>
                <b>{source.coverage}</b>
              </div>
              <div className="source-detail">
                <span>Reporting Period</span>
                <b>{source.reportingPeriod}</b>
              </div>
              <div className="source-detail">
                <span>Metrics</span>
                <b>{source.metrics}</b>
              </div>
              <div className="source-detail">
                <span>Source</span>
                <b>{source.source}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
