import React from 'react';

export default function Reports() {
  return (
    <div className="page-container">
      <div className="placeholder-page">
        <h1>Reports</h1>
        <p>
          Generate compliance reports, PDF summaries, and public carbon disclosures once emissions datasets are integrated.
        </p>
        <div 
          className="kpi-card" 
          style={{ 
            maxWidth: '320px', 
            margin: '0 auto', 
            opacity: 0.6,
            textAlign: 'left',
            fontFamily: 'var(--font-mono)' 
          }}
        >
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold' }}>
            REPORT PREVIEW
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '4px 0' }}>
            <span>Reporting Period:</span>
            <span>--</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '4px 0' }}>
            <span>Data Points Audited:</span>
            <span>0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '4px 0' }}>
            <span>Verification Status:</span>
            <span style={{ color: 'var(--warning)' }}>Awaiting Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
