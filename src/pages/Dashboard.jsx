import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import KpiGrid from '../components/KpiGrid';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import { DEMO_PERSONAL_FOOTPRINT } from '../data/mockData';

export default function Dashboard() {
  const [demoConnected, setDemoConnected] = useState(false);

  const data = demoConnected ? DEMO_PERSONAL_FOOTPRINT : null;
  const hasData = !!data;

  const handleToggleDemo = () => {
    setDemoConnected(!demoConnected);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          fontFamily: 'var(--font-mono)'
        }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{label}</p>
          <p style={{ color: 'var(--accent)', fontSize: '13px' }}>
            Footprint: <b>{payload[0].value} kg CO₂e</b>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="personal-dash-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Your Carbon Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Track and manage your individual carbon footprint
          </p>
        </div>
        <button onClick={handleToggleDemo} className="demo-connect-btn">
          {demoConnected ? "🔌 Disconnect Demo Profile" : "🔌 Connect Demo Profile"}
        </button>
      </div>

      {/* KPI Cards */}
      <KpiGrid>
        <KpiCard
          title="Personal Footprint"
          value={hasData ? `${data.total} t` : null}
          desc={hasData ? "Annual emission estimate" : null}
          isEmpty={!hasData}
        />
        <KpiCard
          title="Monthly Change"
          value={hasData ? "-8%" : null}
          desc={hasData ? "vs. previous month" : null}
          isEmpty={!hasData}
        />
        <KpiCard
          title="Largest Source"
          value={hasData ? "Transport" : null}
          desc={hasData ? "42% of total emissions" : null}
          isEmpty={!hasData}
        />
        <KpiCard
          title="Activities Logged"
          value={hasData ? `${data.activities.length}` : "0"}
          desc={hasData ? "Total logged records" : "No records tracked"}
          isEmpty={!hasData}
        />
      </KpiGrid>

      <div className="analytics-grid" style={{ marginTop: '24px' }}>
        {/* Carbon Trend */}
        <ChartCard
          title="Carbon Trend"
          subtitle="Monthly emission trend in kg CO₂e"
          empty={!hasData}
        >
          {hasData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.trend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="personalCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  fontFamily="var(--font-mono)"
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={11} 
                  fontFamily="var(--font-mono)"
                  tickLine={false}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="var(--accent)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#personalCo2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Activity Breakdown */}
        <div className="chart-card">
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <div className="chart-title-wrapper">
              <h3>Activity Breakdown</h3>
              <p>Carbon weight breakdown by activity category</p>
            </div>
          </div>
          <div className="source-bars-list" style={{ marginTop: '0px' }}>
            {(hasData ? data.sources : [
              { label: "Transport", percentage: 0, value: "--" },
              { label: "Energy", percentage: 0, value: "--" },
              { label: "Food", percentage: 0, value: "--" },
              { label: "Travel", percentage: 0, value: "--" },
              { label: "Other", percentage: 0, value: "--" }
            ]).map((source, idx) => (
              <div className="source-bar-item" key={idx}>
                <span className="label" style={{ minWidth: '80px' }}>{source.label}</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <span className="value">{source.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-grid" style={{ marginTop: '24px' }}>
        {/* Recent Activity */}
        <div className="chart-card">
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <div className="chart-title-wrapper">
              <h3>Recent Activity</h3>
              <p>Recently tracked footprint activities</p>
            </div>
          </div>
          {hasData ? (
            <ul className="activity-list">
              {data.activities.map((act, idx) => (
                <li key={idx}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{act.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.type}</span>
                  </div>
                  <b>{act.delta}</b>
                </li>
              ))}
            </ul>
          ) : (
            <div className="comparison-result" style={{ border: 'none', background: 'none', padding: '16px 0' }}>
              <div className="state-overlay">
                <div className="state-icon">➕</div>
                <div className="state-title">No Activities Logged</div>
                <div className="state-desc">You have not tracked any emissions. Click "Add activity" to start.</div>
              </div>
            </div>
          )}
          <button className="add-activity-btn" style={{ marginTop: '24px' }}>
            + Add activity
          </button>
        </div>

        {/* Reduction Progress */}
        <div className="chart-card">
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <div className="chart-title-wrapper">
              <h3>Reduction Progress</h3>
              <p>Annual savings progress vs. target goal</p>
            </div>
          </div>
          <div className="comparison-result" style={{ border: 'none', background: 'none', padding: '0px' }}>
            {hasData ? (
              <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span>Annual Savings Goal</span>
                  <b style={{ color: 'var(--accent)' }}>12%</b>
                </div>
                <div className="bar-track" style={{ height: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                  <div className="bar-fill" style={{ width: '85%', borderRadius: '6px' }}></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Calculated footprint:</span>
                    <b>6.2 t</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Target footprint:</span>
                    <b>5.5 t</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Remaining reduction:</span>
                    <b>0.7 t</b>
                  </div>
                </div>
              </div>
            ) : (
              <div className="state-overlay">
                <div className="state-icon">🎯</div>
                <div className="state-title">No Reduction Goal Active</div>
                <div className="state-desc">Add activities to measure and model your path toward reduction targets.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
