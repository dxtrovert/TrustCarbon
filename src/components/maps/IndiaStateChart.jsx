import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { INDIA_STATE_DATA } from '../../data/realData';

const METRICS = [
  { key: 'co2PerCapita', label: 'CO₂ per capita', unit: 'kg/person', color: 'var(--accent)' },
  { key: 'co2Total', label: 'Total CO₂', unit: 'Mt CO₂', color: 'var(--primary)' },
  { key: 'coPerCapita', label: 'CO per capita', unit: 'kg/person', color: '#65776b' },
  { key: 'ch4PerCapita', label: 'CH₄ per capita', unit: 'kg/person', color: '#9a7046' },
];
const MAP_COLORS = ['#e5eadf', '#c2cfb8', '#849b79', '#42644a'];
const MAP_WIDTH = 840;
const MAP_HEIGHT = 590;
const MAP_PADDING = 14;
const REQUIRED_NORTHERN_BOUNDARIES = {
  'IN-JK': 'Jammu and Kashmir',
  'IN-LA': 'Ladakh',
  'IN-HP': 'Himachal Pradesh',
  'IN-UK': 'Uttarakhand',
  'IN-AR': 'Arunachal Pradesh',
};
const ISO_TO_TRUSTCARBON_STATE = {
  'IN-AP': 'Andhra Pradesh',
  'IN-AR': 'Arunachal',
  'IN-AS': 'Assam',
  'IN-BR': 'Bihar',
  'IN-CG': 'Chattisgarh',
  'IN-GA': 'Goa',
  'IN-GJ': 'Gujarat',
  'IN-HR': 'Haryana',
  'IN-HP': 'Himachal Pradesh',
  'IN-JK': 'Jammu & Kashmir',
  'IN-JH': 'Jharkhand',
  'IN-KA': 'Karnataka',
  'IN-KL': 'Kerala',
  'IN-MP': 'Madhya Pradesh',
  'IN-MH': 'Maharashtra',
  'IN-MN': 'Manipur',
  'IN-ML': 'Meghalaya',
  'IN-MZ': 'Mizoram',
  'IN-NL': 'Nagaland',
  'IN-OD': 'Odhisha',
  'IN-PB': 'Punjab',
  'IN-RJ': 'Rajasthan',
  'IN-SK': 'Sikkim',
  'IN-TN': 'Tamilnadu',
  'IN-TR': 'Tripura',
  'IN-UP': 'Uttar Pradesh',
  'IN-UK': 'Uttarakhand',
  'IN-WB': 'West Bengal',
};

const normalizeState = (name) => name.toLowerCase().replace(/[^a-z]/g, '');

const visitCoordinates = (coordinates, visit) => {
  if (typeof coordinates[0] === 'number') {
    visit(coordinates);
    return;
  }
  coordinates.forEach((child) => visitCoordinates(child, visit));
};

function projectIndiaCoordinate([longitude, latitude]) {
  const radians = Math.PI / 180;
  const standardParallel1 = 15 * radians;
  const standardParallel2 = 30 * radians;
  const latitudeOrigin = 22 * radians;
  const centralMeridian = 82 * radians;
  const n = (Math.sin(standardParallel1) + Math.sin(standardParallel2)) / 2;
  const c = Math.cos(standardParallel1) ** 2 + 2 * n * Math.sin(standardParallel1);
  const rho = (phi) => Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
  const rhoOrigin = rho(latitudeOrigin);
  const theta = n * (longitude * radians - centralMeridian);
  const radius = rho(latitude * radians);
  return [radius * Math.sin(theta), rhoOrigin - radius * Math.cos(theta)];
}

function geometryPath(geometry, project) {
  const rings = [];
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  polygons.forEach((polygon) => {
    polygon.forEach((ring) => {
      rings.push(ring.map((coordinate, index) => {
        const [x, y] = project(coordinate);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ') + ' Z');
    });
  });
  return rings.join(' ');
}

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>{metric.label}: {payload[0].value.toFixed(2)} {metric.unit}</span>
    </div>
  );
}

export default function IndiaStateChart() {
  const [activeMetric, setActiveMetric] = useState('co2PerCapita');
  const [boundaries, setBoundaries] = useState([]);
  const [mapError, setMapError] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [hoveredState, setHoveredState] = useState('');
  const metric = METRICS.find((item) => item.key === activeMetric);

  useEffect(() => {
    let active = true;
    fetch('/assets/india-states.geojson')
      .then((response) => {
        if (!response.ok) throw new Error(`Map boundaries could not be loaded (${response.status}).`);
        return response.json();
      })
      .then((geojson) => {
        if (geojson.title !== 'India' || !Array.isArray(geojson.features) || geojson.features.length !== 36) {
          throw new Error('The India state boundary dataset is incomplete.');
        }
        const stateIds = geojson.features.map((feature) => feature.properties?.['iso3166-2']);
        if (stateIds.some((id) => !id || !id.startsWith('IN-')) || new Set(stateIds).size !== stateIds.length) {
          throw new Error('The India state boundary dataset has missing or duplicate state identifiers.');
        }
        const namesById = new Map(geojson.features.map((feature) => [
          feature.properties['iso3166-2'],
          feature.properties.name,
        ]));
        if (Object.entries(REQUIRED_NORTHERN_BOUNDARIES).some(([id, name]) => namesById.get(id) !== name)) {
          throw new Error('The India state boundary dataset is missing expected northern state geometry.');
        }
        if (active) setBoundaries(geojson.features);
      })
      .catch((error) => {
        if (active) setMapError(error.message || 'Map boundaries could not be loaded.');
      });
    return () => { active = false; };
  }, []);

  const mapModel = useMemo(() => {
    if (!boundaries.length) return { groups: [] };
    const bounds = [Infinity, Infinity, -Infinity, -Infinity];
    boundaries.forEach(({ geometry }) => {
      visitCoordinates(geometry.coordinates, (coordinate) => {
        const [x, y] = projectIndiaCoordinate(coordinate);
        bounds[0] = Math.min(bounds[0], x);
        bounds[1] = Math.min(bounds[1], y);
        bounds[2] = Math.max(bounds[2], x);
        bounds[3] = Math.max(bounds[3], y);
      });
    });
    const projectedWidth = bounds[2] - bounds[0];
    const projectedHeight = bounds[3] - bounds[1];
    const scale = Math.min(
      (MAP_WIDTH - MAP_PADDING * 2) / projectedWidth,
      (MAP_HEIGHT - MAP_PADDING * 2) / projectedHeight,
    );
    const shapeWidth = projectedWidth * scale;
    const shapeHeight = projectedHeight * scale;
    const offsetX = (MAP_WIDTH - shapeWidth) / 2;
    const offsetY = (MAP_HEIGHT - shapeHeight) / 2;
    const project = (coordinate) => {
      const [x, y] = projectIndiaCoordinate(coordinate);
      return [
        offsetX + (x - bounds[0]) * scale,
        MAP_HEIGHT - offsetY - (y - bounds[1]) * scale,
      ];
    };
    const groups = new Map();
    boundaries.forEach((feature) => {
      const id = feature.properties['iso3166-2'];
      if (!groups.has(id)) groups.set(id, { id, name: feature.properties.name, shapes: [] });
      groups.get(id).shapes.push({
        id: feature.id,
        path: geometryPath(feature.geometry, project),
      });
    });
    return { groups: [...groups.values()] };
  }, [boundaries]);

  const dataByStateId = useMemo(() => {
    const entriesByName = new Map(
      INDIA_STATE_DATA.map((entry) => [normalizeState(entry.state), entry]),
    );
    return new Map(
      Object.entries(ISO_TO_TRUSTCARBON_STATE)
        .map(([id, name]) => [id, entriesByName.get(normalizeState(name))])
        .filter(([, entry]) => entry),
    );
  }, []);

  const sorted = useMemo(
    () => activeMetric === 'co2Total'
      ? []
      : [...INDIA_STATE_DATA].sort((first, second) => second[activeMetric] - first[activeMetric]),
    [activeMetric],
  );
  const values = sorted.map((entry) => entry[activeMetric]).sort((first, second) => first - second);
  const quartiles = values.length
    ? [values[Math.floor(values.length * 0.25)], values[Math.floor(values.length * 0.5)], values[Math.floor(values.length * 0.75)]]
    : [];
  const valueForState = (stateId) => dataByStateId.get(stateId);
  const fillForState = (state) => {
    const value = activeMetric === 'co2Total' ? undefined : valueForState(state)?.[activeMetric];
    if (value === undefined || quartiles.length !== 3) return '#e5e3dc';
    return MAP_COLORS[value > quartiles[2] ? 3 : value > quartiles[1] ? 2 : value > quartiles[0] ? 1 : 0];
  };
  const selectedData = valueForState(selectedState);
  const selectedStateName = boundaries.find((feature) => feature.properties['iso3166-2'] === selectedState)?.properties.name;
  const selectedMetricValue = selectedData && activeMetric !== 'co2Total'
    ? selectedData[activeMetric]
    : null;
  const tooltipState = hoveredState || selectedState;
  const tooltipData = valueForState(tooltipState);
  const tooltipMetricValue = tooltipData && activeMetric !== 'co2Total'
    ? tooltipData[activeMetric]
    : null;
  const tooltipStateName = boundaries.find((feature) => feature.properties['iso3166-2'] === tooltipState)?.properties.name;

  const handleMapKeyDown = (event, state) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedState(state);
    }
  };

  return (
    <div className="india-research-layout">
      <div className="india-map-panel">
        <div className="research-panel-heading">
          <div>
            <span className="section-index">STATE SNAPSHOT</span>
            <h3>{metric.label}</h3>
          </div>
          <span className="unit-note">{metric.unit}</span>
        </div>
        {mapError ? <p role="alert">{mapError}</p> : boundaries.length === 0 ? (
          <p role="status">Loading state boundaries...</p>
        ) : (
          <svg className="india-heatmap" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="group" aria-label={`Map of Indian states shaded by ${metric.label}`}>
            {mapModel.groups.map(({ id, name, shapes }) => {
              const stateData = valueForState(id);
              return (
                <g
                  key={id}
                  data-state-id={id}
                  className={`india-map-state${selectedState === id ? ' selected' : ''}`}
                  tabIndex="0"
                  role="button"
                  aria-label={stateData && activeMetric !== 'co2Total'
                    ? `${name}: ${stateData[activeMetric].toFixed(2)} ${metric.unit}`
                    : `${name}: No data for ${metric.label}`}
                  onMouseEnter={() => setHoveredState(id)}
                  onMouseLeave={() => setHoveredState('')}
                  onFocus={() => setHoveredState(id)}
                  onBlur={() => setHoveredState('')}
                  onClick={() => setSelectedState(id)}
                  onKeyDown={(event) => handleMapKeyDown(event, id)}
                  fill={fillForState(id)}
                >
                  {shapes.map((shape) => <path key={shape.id} d={shape.path} />)}
                </g>
              );
            })}
          </svg>
        )}
        <div className="map-legend" aria-label="Emissions intensity legend">
          {['Low', 'Medium', 'High', 'Very high'].map((label, index) => (
            <span className="legend-level" key={label}><i style={{ background: MAP_COLORS[index] }} />{label}</span>
          ))}
          <span className="legend-unavailable"><i /> No data</span>
        </div>
        <div className="map-state-readout" aria-live="polite">
          {tooltipState ? (
            <>
              <strong>{tooltipStateName}</strong>
              <span className="map-value-readout">
                {tooltipMetricValue !== null
                  ? `${tooltipMetricValue.toFixed(2)} ${metric.unit}`
                  : activeMetric === 'co2Total'
                    ? 'No total CO₂ data in the supplied dataset'
                    : 'No data'}
                <small>Year: not provided by the source dataset</small>
              </span>
            </>
          ) : <span>Point to or select a state to inspect its value.</span>}
        </div>
        <p className="map-source-note">
          State boundaries: <a href="https://code.highcharts.com/mapdata/countries/in/in-all.geo.json" target="_blank" rel="noreferrer">Highcharts India admin-1 boundary data</a>, Copyright (c) Highsoft AS, based on <a href="https://openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>. Features are joined by ISO 3166-2 identifiers and projected with an Albers equal-area conic projection. The source includes Jammu and Kashmir and Ladakh as separate features. Emissions: CarbonEmissionIndia dataset. The supplied single-period snapshot has no reporting year.
        </p>
      </div>

      <div className="india-comparison-panel" id="india-state-comparison">
        <div className="research-panel-heading">
          <div>
            <span className="section-index">STATE COMPARISON</span>
            <h3>Reported per-capita indicators</h3>
          </div>
          <div className="chart-controls">
            {METRICS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`research-tab${activeMetric === item.key ? ' active' : ''}`}
                onClick={() => setActiveMetric(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {selectedState && (
          <div className="selected-state-note" role="status">
            <strong>{selectedStateName}</strong>
            <span>
              {selectedMetricValue !== null
                ? `${selectedMetricValue.toFixed(2)} ${metric.unit}`
                : activeMetric === 'co2Total'
                  ? 'No total CO₂ data in the supplied dataset'
                  : 'No data'}
            </span>
            <span>Year: not provided by the source dataset</span>
            <button type="button" onClick={() => setSelectedState('')}>Clear selection</button>
          </div>
        )}
        {sorted.length ? (
          <div className="india-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} margin={{ top: 8, right: 8, left: -12, bottom: 56 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="state" stroke="var(--text-secondary)" fontSize={10} tickLine={false} angle={-35} textAnchor="end" />
                <YAxis stroke="var(--text-secondary)" fontSize={10} fontFamily="var(--font-mono)" tickLine={false} />
                <Tooltip content={<CustomTooltip metric={metric} />} />
                <Bar dataKey={activeMetric} maxBarSize={28} fill={metric.color}>
                  {sorted.map((entry) => (
                    <Cell
                      key={entry.state}
                      fill={metric.color}
                      fillOpacity={!selectedState || normalizeState(ISO_TO_TRUSTCARBON_STATE[selectedState] || '') === normalizeState(entry.state) ? 1 : 0.28}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="country-empty-state">Total CO₂ is unavailable in the supplied per-capita snapshot. No state totals have been inferred.</p>
        )}
        <p className="map-source-note">
          Source values are reproduced as supplied. The file has no reporting year or state total emissions. States and union territories without a matching source value are shown as unavailable.
        </p>
      </div>
    </div>
  );
}
