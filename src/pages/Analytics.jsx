import React from 'react';

export default function Analytics() {
  return (
    <div className="page-container">
      <div className="placeholder-page">
        <h1>Advanced Analytics</h1>
        <p>
          Custom forecasts, carbon intensity indicators, and anomaly detection models will appear here once carbon datasets are connected.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <div className="kpi-card" style={{ width: '200px', opacity: 0.6 }}>
            <span className="kpi-label">Anomaly Detection</span>
            <div className="kpi-value">--</div>
            <div className="kpi-desc">Requires active feed</div>
          </div>
          <div className="kpi-card" style={{ width: '200px', opacity: 0.6 }}>
            <span className="kpi-label">Forecasting Model</span>
            <div className="kpi-value">--</div>
            <div className="kpi-desc">Awaiting historical data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
