import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  COUNTRIES,
  getCountryData,
  getCountryLatest,
  LATEST_YEAR,
  REGIONAL_DATA,
  TABLE_DATA,
} from '../data/realData';

function CountryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>{payload[0].value.toFixed(2)} Mt CO₂</span>
    </div>
  );
}

export default function CountryExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const filteredCountries = useMemo(() => (
    searchQuery
      ? COUNTRIES.filter((country) => country.toLowerCase().includes(searchQuery.toLowerCase()))
      : COUNTRIES
  ), [searchQuery]);
  const countryHistory = useMemo(
    () => selectedCountry ? getCountryData(selectedCountry) : [],
    [selectedCountry],
  );
  const countryLatest = useMemo(
    () => selectedCountry ? getCountryLatest(selectedCountry) : null,
    [selectedCountry],
  );
  const countryMetadata = useMemo(
    () => TABLE_DATA.find((row) => row.entity === selectedCountry && row.year === LATEST_YEAR),
    [selectedCountry],
  );
  const regionComparison = useMemo(
    () => REGIONAL_DATA.find((row) => row.region === countryMetadata?.region),
    [countryMetadata],
  );
  const totalEmissions = useMemo(
    () => countryHistory.reduce((total, row) => total + row.co2Mt, 0),
    [countryHistory],
  );

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setSearchQuery(country);
  };

  return (
    <div className="country-explorer">
      <div className="research-panel-heading">
        <div>
          <span className="section-index">COUNTRY RECORDS</span>
          <h3>Country Explorer</h3>
          <p>Search or select a country to inspect reported values and history.</p>
        </div>
      </div>

      <div className="country-filters">
        <div className="search-field">
          <label htmlFor="country-search">Search country</label>
          <input
            id="country-search"
            type="search"
            placeholder="Type a country name"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedCountry('');
            }}
            className="text-input"
            role="combobox"
            aria-expanded={Boolean(searchQuery && !selectedCountry && filteredCountries.length)}
            aria-controls="country-search-results"
          />
          {searchQuery && !selectedCountry && filteredCountries.length > 0 && (
            <ul className="country-search-results" id="country-search-results" role="listbox">
              {filteredCountries.slice(0, 8).map((country) => (
                <li key={country}>
                  <button type="button" role="option" onClick={() => selectCountry(country)}>{country}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="search-field">
          <label htmlFor="country-select">Country list</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(event) => selectCountry(event.target.value)}
            className="select-input"
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>
      </div>

      {!selectedCountry ? (
        <div className="country-empty-state">
          <span className="section-index">AVAILABLE RECORDS</span>
          <p>Select a country to load its available history.</p>
        </div>
      ) : (
        <>
          <dl className="country-metrics">
            <div><dt>Country</dt><dd>{selectedCountry}</dd></div>
            <div><dt>Latest available year</dt><dd>{countryLatest?.year ?? 'Data unavailable'}</dd></div>
            <div><dt>Latest total emissions</dt><dd>{countryLatest ? `${countryLatest.co2Mt.toFixed(2)} Mt CO₂` : 'Data unavailable'}</dd></div>
            <div><dt>Latest per capita</dt><dd>{countryLatest ? `${countryLatest.perCapita.toFixed(2)} t/person` : 'Data unavailable'}</dd></div>
            <div><dt>Sum of annual totals, not cumulative</dt><dd>{countryHistory.length ? `${totalEmissions.toFixed(2)} Mt CO₂` : 'Data unavailable'}</dd></div>
            <div><dt>Latest regional comparison</dt><dd>{regionComparison ? `${countryMetadata.region}: ${regionComparison.co2.toFixed(2)} Mt` : 'Data unavailable'}</dd></div>
          </dl>

          <div className="country-history">
            <div className="research-panel-heading">
              <div>
                <span className="section-index">ANNUAL HISTORY</span>
                <h3>{selectedCountry}, {countryHistory[0]?.year} to {countryLatest?.year}</h3>
              </div>
              <span className="unit-note">Mt CO₂</span>
            </div>
            <div className="country-history-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={countryHistory} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="countryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.16} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="year" stroke="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)" tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} fontFamily="var(--font-mono)" tickLine={false} />
                  <Tooltip content={<CountryTooltip />} />
                  <Area type="monotone" dataKey="co2Mt" stroke="var(--primary)" strokeWidth={2} fill="url(#countryGrad)" name="CO₂ emissions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="map-source-note">
            Source: Carbon (CO₂) Emissions by Country CSV. Per-capita values are reported as supplied. Regional comparison uses the latest available regional total.
          </p>
        </>
      )}
    </div>
  );
}
