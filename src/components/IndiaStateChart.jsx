import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { INDIA_STATE_DATA } from '../data/realData';

const METRICS = [
  { key: 'co2PerCapita', label: 'CO₂ per capita', unit: 'kg/person', color: 'var(--accent)' },
  { key: 'coPerCapita',  label: 'CO per capita',  unit: 'kg/person', color: '#2196f3' },
  { key: 'ch4PerCapita', label: 'CH₄ per capita', unit: 'kg/person', color: '#ff9800' },
];

export default function IndiaStateChart() {
  const [activeMetric, setActiveMetric] = useState('co2PerCapita');
  const metric = METRICS.find(m => m.key === activeMetric);

  // Sort by active metric descending
  const sorted = [...INDIA_STATE_DATA].sort((a, b) => b[activeMetric] - a[activeMetric]);
  const maxVal = sorted[0]?.[activeMetric] || 1;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: metric.color }}>
            {metric.label}: <b>{payload[0]?.value?.toFixed(2)} {metric.unit}</b>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card" style={{ marginBottom: '32px' }}>
      <div className="chart-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div className="chart-title-wrapper">
          <h3>India State Carbon Data</h3>
          <p>Per-capita emissions by Indian state — CO₂, CO &amp; CH₄</p>
        </div>
        <div className="chart-controls">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: `1.5px solid ${activeMetric === m.key ? m.color : 'var(--border)'}`,
                background: activeMetric === m.key ? m.color + '22' : 'transparent',
                color: activeMetric === m.key ? m.color : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ height: '320px', marginTop: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            margin={{ top: 10, right: 10, left: -10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="state"
              stroke="var(--text-secondary)"
              fontSize={10}
              tickLine={false}
              dy={8}
              angle={-35}
              textAnchor="end"
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              dx={-4}
              tickFormatter={v => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={activeMetric} radius={[4, 4, 0, 0]} maxBarSize={32}>
              {sorted.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={metric.color}
                  fillOpacity={0.4 + 0.6 * (entry[activeMetric] / maxVal)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State comparison strip */}
      <div style={{ marginTop: '16px' }}>
        <span className="kpi-label" style={{ display: 'block', marginBottom: '8px' }}>
          State Comparison — {metric.label} ({metric.unit})
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {sorted.slice(0, 10).map((s, i) => (
            <div key={s.state} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              fontSize: '12px'
            }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: metric.color + '33',
                border: `1.5px solid ${metric.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '10px',
                color: metric.color,
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, color: 'var(--text)', fontWeight: 500 }}>{s.state}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: metric.color, fontWeight: 700 }}>
                {s[activeMetric].toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px' }}>
        Note: All values are per-capita figures (kg per person). Source: CarbonEmissionIndia dataset.
      </p>
    </div>
  );
}
