import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { COUNTRIES, getCountryData, getCountryLatest } from '../data/realData';

export default function CountryExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Filter country list by search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES.slice(0, 8);
    return COUNTRIES.filter(c =>
      c.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  const countryHistory = useMemo(() => {
    if (!selectedCountry) return [];
    return getCountryData(selectedCountry);
  }, [selectedCountry]);

  const countryLatest = useMemo(() => {
    if (!selectedCountry) return null;
    return getCountryLatest(selectedCountry);
  }, [selectedCountry]);

  const handleSelectCountry = (c) => {
    setSelectedCountry(c);
    setSearchQuery(c);
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
          fontFamily: 'var(--font-mono)',
          fontSize: '12px'
        }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Year: {label}</p>
          <p style={{ color: 'var(--accent)' }}>
            CO₂: <b>{payload[0]?.value?.toFixed(2)} Mt</b>
          </p>
          {payload[1] && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              Per Capita: <b>{payload[1].value?.toFixed(2)} t</b>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card" style={{ marginBottom: '32px' }}>
      <div className="chart-header">
        <div className="chart-title-wrapper">
          <h3>Country Explorer</h3>
          <p>Search a country to view its emissions history from the dataset</p>
        </div>
      </div>

      {/* Search & Autocomplete */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="search-field">
          <label htmlFor="country-search">Search Country</label>
          <input
            id="country-search"
            type="text"
            placeholder="e.g. Algeria, Armenia..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCountry('');
            }}
            className="text-input"
          />
          {/* Dropdown suggestions */}
          {searchQuery && !selectedCountry && filteredCountries.length > 0 && (
            <div style={{
              position: 'absolute',
              zIndex: 10,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              marginTop: '4px',
              width: '100%',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {filteredCountries.map(c => (
                <div
                  key={c}
                  onClick={() => handleSelectCountry(c)}
                  style={{
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Select dropdown as alternative */}
        <div className="search-field">
          <label htmlFor="country-select">Or Select From List</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => handleSelectCountry(e.target.value)}
            className="select-input"
            style={{ height: '38px', width: '100%' }}
          >
            <option value="">-- Select Country --</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {!selectedCountry ? (
        <div className="state-overlay" style={{ height: '220px', position: 'relative' }}>
          <div className="state-icon">🌍</div>
          <div className="state-title">Select a Country</div>
          <div className="state-desc">Search or select from the dropdown to view emissions data.</div>
        </div>
      ) : (
        <div>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="kpi-card" style={{ padding: '16px' }}>
              <span className="kpi-label">Country</span>
              <div className="kpi-value" style={{ fontSize: '20px' }}>{selectedCountry}</div>
              <div className="kpi-desc">Selected entity</div>
            </div>
            <div className="kpi-card" style={{ padding: '16px' }}>
              <span className="kpi-label">Latest CO₂ (Mt)</span>
              <div className="kpi-value" style={{ fontSize: '24px' }}>
                {countryLatest ? countryLatest.co2Mt.toFixed(2) : '--'}
              </div>
              <div className="kpi-desc">
                Megatons in {countryLatest ? countryLatest.year : '--'}
              </div>
            </div>
            <div className="kpi-card" style={{ padding: '16px' }}>
              <span className="kpi-label">Per Capita (t)</span>
              <div className="kpi-value" style={{ fontSize: '24px' }}>
                {countryLatest ? countryLatest.perCapita.toFixed(2) : '--'}
              </div>
              <div className="kpi-desc">
                Metric tons per person in {countryLatest ? countryLatest.year : '--'}
              </div>
            </div>
          </div>

          {/* Historical Trend Chart */}
          <div style={{ marginBottom: '8px' }}>
            <span className="kpi-label" style={{ display: 'block', marginBottom: '8px' }}>
              Historical CO₂ Trend — {selectedCountry}
            </span>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={countryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="countryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="year"
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
                    dataKey="co2Mt"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#countryGrad)"
                    name="CO₂ (Mt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
