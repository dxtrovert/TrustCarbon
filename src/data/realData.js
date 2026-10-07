/**
 * realData.js
 * Parses and processes data from the two uploaded CSV datasets:
 *   1. Carbon_(CO2)_Emissions_by_Country.csv  — Country-level CO2, 1990–2019
 *   2. CarbonEmissionIndia.csv (rawIndiaData.csv) — Indian state per-capita values
 *
 * No fake/hardcoded numbers. Everything is derived from the raw rows below.
 */

// ─────────────────────────────────────────────────────────────────────────────
// RAW ROWS  (parsed from the two CSV files; structure preserved exactly)
// Columns: Country, Region, Year (extracted from Date), KilotonsCO2, MetricTonsPerCapita
// ─────────────────────────────────────────────────────────────────────────────

const RAW_COUNTRY_ROWS = [
  // Afghanistan – Asia
  ["Afghanistan","Asia",2011,8930,0.31],["Afghanistan","Asia",2012,8080,0.27],
  ["Afghanistan","Asia",2010,7110,0.25],["Afghanistan","Asia",2019,6080,0.16],
  ["Afghanistan","Asia",2018,6070,0.17],["Afghanistan","Asia",2013,5990,0.19],
  ["Afghanistan","Asia",2015,5950,0.18],["Afghanistan","Asia",2016,5300,0.15],
  ["Afghanistan","Asia",2014,4880,0.15],["Afghanistan","Asia",2009,4880,0.18],
  ["Afghanistan","Asia",2017,4780,0.13],["Afghanistan","Asia",2008,3560,0.13],
  ["Afghanistan","Asia",1990,2380,0.22],["Afghanistan","Asia",1991,2230,0.21],
  ["Afghanistan","Asia",2007,1770,0.07],["Afghanistan","Asia",2006,1760,0.07],
  ["Afghanistan","Asia",2005,1550,0.06],["Afghanistan","Asia",1992,1390,0.12],
  ["Afghanistan","Asia",1993,1340,0.10],["Afghanistan","Asia",1994,1290,0.08],
  ["Afghanistan","Asia",1995,1240,0.08],["Afghanistan","Asia",2003,1220,0.05],
  ["Afghanistan","Asia",1996,1180,0.07],["Afghanistan","Asia",1997,1100,0.06],
  ["Afghanistan","Asia",1998,1040,0.06],["Afghanistan","Asia",2004,1030,0.04],
  ["Afghanistan","Asia",2002,1030,0.05],["Afghanistan","Asia",1999,810,0.04],
  ["Afghanistan","Asia",2000,760,0.04],["Afghanistan","Asia",2001,730,0.04],
  // Albania – Europe
  ["Albania","Europe",1990,5980,1.82],["Albania","Europe",2017,5140,1.79],
  ["Albania","Europe",2018,5110,1.78],["Albania","Europe",2011,4850,1.67],
  ["Albania","Europe",2019,4830,1.69],["Albania","Europe",2014,4820,1.67],
  ["Albania","Europe",2015,4620,1.60],["Albania","Europe",2016,4480,1.56],
  ["Albania","Europe",2010,4450,1.53],["Albania","Europe",2013,4440,1.53],
  ["Albania","Europe",2012,4360,1.50],["Albania","Europe",2004,4250,1.40],
  ["Albania","Europe",2009,4220,1.44],["Albania","Europe",2007,4140,1.39],
  ["Albania","Europe",2008,4080,1.38],["Albania","Europe",2003,4070,1.34],
  ["Albania","Europe",1991,4060,1.24],["Albania","Europe",2005,4030,1.34],
  ["Albania","Europe",2006,4010,1.34],["Albania","Europe",2002,3760,1.23],
  ["Albania","Europe",2001,3230,1.06],["Albania","Europe",2000,3170,1.03],
  ["Albania","Europe",1999,2970,0.96],["Albania","Europe",1992,2220,0.68],
  ["Albania","Europe",1994,2070,0.65],["Albania","Europe",1993,2060,0.64],
  ["Albania","Europe",1996,1940,0.61],["Albania","Europe",1995,1930,0.61],
  ["Albania","Europe",1998,1790,0.57],["Albania","Europe",1997,1470,0.47],
  // Algeria – Africa
  ["Algeria","Africa",2019,171250,4.01],["Algeria","Africa",2018,165539.99,3.95],
  ["Algeria","Africa",2017,158340,3.85],["Algeria","Africa",2015,156270,3.95],
  ["Algeria","Africa",2016,154910,3.84],["Algeria","Africa",2014,147740.01,3.81],
  ["Algeria","Africa",2013,139020,3.66],["Algeria","Africa",2012,134929.99,3.62],
  ["Algeria","Africa",2011,120790,3.31],["Algeria","Africa",2010,114180,3.18],
  ["Algeria","Africa",2009,112170,3.19],["Algeria","Africa",2008,107750,3.12],
  ["Algeria","Africa",2007,102750,3.02],["Algeria","Africa",2006,99810,2.99],
  ["Algeria","Africa",2005,94190,2.86],["Algeria","Africa",2004,89490,2.75],
  ["Algeria","Africa",2003,88190,2.75],["Algeria","Africa",2002,82400,2.61],
  ["Algeria","Africa",2000,80050,2.60],["Algeria","Africa",2001,78650,2.52],
  ["Algeria","Africa",1999,77510,2.55],["Algeria","Africa",1995,76440,2.68],
  ["Algeria","Africa",1996,76120,2.63],["Algeria","Africa",1998,74650,2.49],
  ["Algeria","Africa",1997,74430,2.53],["Algeria","Africa",1994,73610,2.63],
  ["Algeria","Africa",1993,72220,2.64],["Algeria","Africa",1992,66840,2.50],
  ["Algeria","Africa",1991,66430,2.54],["Algeria","Africa",1990,62940,2.47],
  // Andorra – Europe
  ["Andorra","Europe",2005,580,7.27],["Andorra","Europe",2004,560,7.28],
  ["Andorra","Europe",2006,550,6.86],["Andorra","Europe",2007,540,6.91],
  ["Andorra","Europe",2008,540,7.10],["Andorra","Europe",2003,530,7.17],
  ["Andorra","Europe",2002,530,7.48],["Andorra","Europe",2009,520,7.04],
  ["Andorra","Europe",2010,520,7.27],["Andorra","Europe",2001,520,7.67],
  ["Andorra","Europe",2000,520,7.87],["Andorra","Europe",1999,510,7.77],
  ["Andorra","Europe",2019,500,6.55],["Andorra","Europe",2018,490,6.53],
  ["Andorra","Europe",2012,490,6.90],["Andorra","Europe",2011,490,6.94],
  ["Andorra","Europe",1998,490,7.52],["Andorra","Europe",2013,480,6.73],
  ["Andorra","Europe",2017,470,6.37],["Andorra","Europe",2016,470,6.48],
  ["Andorra","Europe",2015,470,6.55],["Andorra","Europe",1997,470,7.27],
  ["Andorra","Europe",2014,460,6.42],["Andorra","Europe",1996,450,7.02],
  ["Andorra","Europe",1995,430,6.83],["Andorra","Europe",1994,410,6.72],
  ["Andorra","Europe",1993,410,6.93],["Andorra","Europe",1992,410,7.16],
  ["Andorra","Europe",1991,410,7.40],["Andorra","Europe",1990,410,7.65],
  // Angola – Africa
  ["Angola","Africa",2015,31650,1.13],["Angola","Africa",2016,29760,1.02],
  ["Angola","Africa",2014,29630,1.09],["Angola","Africa",2013,26960,1.03],
  ["Angola","Africa",2019,25210,0.78],["Angola","Africa",2017,24250,0.80],
  ["Angola","Africa",2018,23960,0.77],["Angola","Africa",2012,23870,0.95],
  ["Angola","Africa",2011,23870,0.98],["Angola","Africa",2010,22800,0.98],
  ["Angola","Africa",2009,21150,0.94],["Angola","Africa",2008,19280,0.89],
  ["Angola","Africa",1999,17610,1.11],["Angola","Africa",2004,17450,0.93],
  ["Angola","Africa",2007,16970,0.81],["Angola","Africa",1998,16770,1.09],
  ["Angola","Africa",2003,16760,0.92],["Angola","Africa",2006,16560,0.82],
  ["Angola","Africa",2000,16200,0.99],["Angola","Africa",1997,16160,1.09],
  ["Angola","Africa",2001,15960,0.94],["Angola","Africa",2005,15810,0.81],
  ["Angola","Africa",2002,15690,0.90],["Angola","Africa",1996,15440,1.07],
  ["Angola","Africa",1995,12720,0.91],["Angola","Africa",1994,11300,0.84],
  ["Angola","Africa",1993,9270,0.71],["Angola","Africa",1992,6880,0.54],
  ["Angola","Africa",1991,6670,0.55],["Angola","Africa",1990,6560,0.55],
  // Antigua And Barbuda – Americas
  ["Antigua And Barbuda","Americas",2009,1390,16.44],["Antigua And Barbuda","Americas",2012,700,7.98],
  ["Antigua And Barbuda","Americas",2011,540,6.23],["Antigua And Barbuda","Americas",2019,520,5.65],
  ["Antigua And Barbuda","Americas",2018,510,5.57],["Antigua And Barbuda","Americas",2017,500,5.49],
  ["Antigua And Barbuda","Americas",2016,500,5.52],["Antigua And Barbuda","Americas",2015,490,5.45],
  ["Antigua And Barbuda","Americas",2010,490,5.72],["Antigua And Barbuda","Americas",2014,480,5.38],
  ["Antigua And Barbuda","Americas",2008,480,5.77],["Antigua And Barbuda","Americas",2013,470,5.31],
  ["Antigua And Barbuda","Americas",2007,460,5.61],["Antigua And Barbuda","Americas",2006,440,5.44],
  ["Antigua And Barbuda","Americas",2005,410,5.13],["Antigua And Barbuda","Americas",2003,410,5.25],
  ["Antigua And Barbuda","Americas",2004,400,5.07],["Antigua And Barbuda","Americas",2002,390,5.05],
  ["Antigua And Barbuda","Americas",2001,350,4.59],["Antigua And Barbuda","Americas",2000,330,4.40],
  ["Antigua And Barbuda","Americas",1999,330,4.47],["Antigua And Barbuda","Americas",1998,320,4.41],
  ["Antigua And Barbuda","Americas",1997,290,4.07],["Antigua And Barbuda","Americas",1992,290,4.49],
  ["Antigua And Barbuda","Americas",1996,280,4.01],["Antigua And Barbuda","Americas",1995,270,3.95],
  ["Antigua And Barbuda","Americas",1994,250,3.73],["Antigua And Barbuda","Americas",1993,250,3.80],
  ["Antigua And Barbuda","Americas",1991,220,3.46],["Antigua And Barbuda","Americas",1990,210,3.32],
  // Argentina – Americas
  ["Argentina","Americas",2015,185550,4.30],["Argentina","Americas",2013,183250,4.34],
  ["Argentina","Americas",2016,183160,4.20],["Argentina","Americas",2014,179600.01,4.21],
  ["Argentina","Americas",2017,179320.01,4.07],["Argentina","Americas",2012,177960.01,4.26],
  ["Argentina","Americas",2018,176899.99,3.98],["Argentina","Americas",2011,176640,4.28],
  ["Argentina","Americas",2019,168100.01,3.74],["Argentina","Americas",2008,167230,4.15],
  ["Argentina","Americas",2010,167220,4.10],["Argentina","Americas",2007,162810,4.08],
  ["Argentina","Americas",2009,156570.01,3.85],["Argentina","Americas",2006,154899.99,3.92],
  ["Argentina","Americas",2005,145990.01,3.74],["Argentina","Americas",2004,141380,3.66],
  ["Argentina","Americas",1999,134510,3.67],["Argentina","Americas",1998,132670,3.66],
  ["Argentina","Americas",2000,132270,3.57],["Argentina","Americas",2003,127660,3.34],
  ["Argentina","Americas",1997,126120,3.52],["Argentina","Americas",2001,125260,3.34],
  ["Argentina","Americas",1996,122550,3.46],["Argentina","Americas",2002,117470,3.10],
  ["Argentina","Americas",1995,112890,3.23],["Argentina","Americas",1994,111910,3.24],
  ["Argentina","Americas",1993,110260,3.24],["Argentina","Americas",1992,107930,3.22],
  ["Argentina","Americas",1991,105920,3.20],["Argentina","Americas",1990,100320,3.07],
  // Armenia – Asia
  ["Armenia","Asia",1991,20690,5.72],["Armenia","Asia",1990,19850,5.58],
  ["Armenia","Asia",1992,10900,3.05],["Armenia","Asia",2019,6170,2.19],
  ["Armenia","Asia",2012,5720,1.96],["Armenia","Asia",2018,5710,2.01],
  ["Armenia","Asia",2008,5690,1.91],["Armenia","Asia",2013,5500,1.90],
  ["Armenia","Asia",2014,5480,1.90],["Armenia","Asia",2017,5370,1.88],
  ["Armenia","Asia",2015,5340,1.86],["Armenia","Asia",2007,5200,1.73],
  ["Armenia","Asia",2016,5070,1.77],["Armenia","Asia",1993,5040,1.46],
  ["Armenia","Asia",2011,4940,1.69],["Armenia","Asia",2009,4510,1.52],
  ["Armenia","Asia",2006,4490,1.48],["Armenia","Asia",2005,4460,1.46],
  ["Armenia","Asia",2010,4340,1.47],["Armenia","Asia",2004,3760,1.23],
  ["Armenia","Asia",2001,3600,1.15],["Armenia","Asia",2000,3560,1.12],
  ["Armenia","Asia",1995,3510,1.06],["Armenia","Asia",2003,3500,1.13],
  ["Armenia","Asia",1998,3470,1.07],["Armenia","Asia",1997,3340,1.02],
  ["Armenia","Asia",2002,3120,1.00],["Armenia","Asia",1999,3110,0.97],
  ["Armenia","Asia",1994,2740,0.81],["Armenia","Asia",1996,2580,0.78],
  // Australia – Oceania
  ["Australia","Oceania",2009,395290.01,18.22],["Australia","Oceania",2017,389160,15.82],
  ["Australia","Oceania",2008,388940,18.30],["Australia","Oceania",2010,387540.01,17.59],
  ["Australia","Oceania",2018,387070.01,15.50],["Australia","Oceania",2012,386970,17.02],
  ["Australia","Oceania",2019,386530,15.25],["Australia","Oceania",2011,386380,17.30],
  ["Australia","Oceania",2007,385750,18.52],["Australia","Oceania",2016,384989.99,15.91],
  ["Australia","Oceania",2013,380280,16.44],["Australia","Oceania",2015,377799.99,15.86],
  ["Australia","Oceania",2006,375489.99,18.36],["Australia","Oceania",2014,371630,15.83],
  ["Australia","Oceania",2005,370090,18.34],["Australia","Oceania",2004,365810,18.35],
  ["Australia","Oceania",2002,353370,18.13],["Australia","Oceania",2003,352579.99,17.88],
  ["Australia","Oceania",2001,345640,17.93],["Australia","Oceania",2000,339450,17.84],
  ["Australia","Oceania",1999,333710,17.74],["Australia","Oceania",1998,328620,17.66],
  ["Australia","Oceania",1997,307850,16.71],["Australia","Oceania",1996,300810,16.51],
  ["Australia","Oceania",1995,290180,16.12],["Australia","Oceania",1994,280180,15.74],
  ["Australia","Oceania",1993,273050,15.48],["Australia","Oceania",1992,268400,15.36],
  ["Australia","Oceania",1991,264760,15.32],["Australia","Oceania",1990,263630,15.45],
];

// India state per-capita data
const RAW_INDIA_ROWS = [
  ["Andhra Pradesh", 974.17, 27.18, 16.97],
  ["Arunachal", 405.90, 17.43, 25.82],
  ["Assam", 340.91, 16.63, 21.29],
  ["Bihar", 179.01, 8.83, 9.59],
  ["Chattisgarh", 1963.88, 17.56, 22.37],
  ["Goa", 2662.51, 23.12, 7.62],
  ["Gujarat", 1310.58, 24.01, 12.26],
  ["Haryana", 1381.86, 17.90, 21.57],
  ["Himachal Pradesh", 784.16, 16.98, 18.28],
  ["Jammu & Kashmir", 509.03, 15.59, 14.42],
  ["Jharkhand", 1403.43, 15.02, 15.39],
  ["Karnataka", 888.86, 24.93, 12.20],
  ["Kerala", 780.12, 18.29, 4.52],
  ["Madhya Pradesh", 656.37, 16.14, 15.15],
  ["Maharashtra", 936.70, 23.58, 9.80],
  ["Manipur", 379.20, 10.80, 22.63],
  ["Meghalaya", 691.53, 12.65, 19.80],
  ["Mizoram", 754.71, 15.40, 10.72],
  ["Nagaland", 1275.27, 24.13, 29.08],
  ["Odhisha", 700.13, 18.40, 19.88],
  ["Punjab", 1618.08, 27.90, 33.38],
  ["Rajasthan", 793.69, 14.33, 14.18],
  ["Sikkim", 711.39, 11.68, 10.04],
  ["Tamilnadu", 985.70, 26.60, 10.40],
  ["Tripura", 295.64, 17.76, 19.23],
  ["Uttar Pradesh", 404.26, 12.40, 12.87],
  ["Uttarakhand", 493.01, 14.28, 17.93],
  ["West Bengal", 763.13, 22.69, 15.99],
];

// ─────────────────────────────────────────────────────────────────────────────
// DERIVED STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────

// Full table rows (for DataTable)
export const TABLE_DATA = RAW_COUNTRY_ROWS.map(([country, region, year, kt, perCapita]) => ({
  entity: country,
  region,
  year,
  // Convert kilotons → megatons (Mt) for readability in the table
  emissions: kt / 1000,   // Mt CO₂
  perCapita,
}));

// Unique countries
export const COUNTRIES = [...new Set(RAW_COUNTRY_ROWS.map(r => r[0]))].sort();

// Unique regions
export const REGIONS = [...new Set(RAW_COUNTRY_ROWS.map(r => r[1]))].sort();

// Available years
export const YEARS = [...new Set(RAW_COUNTRY_ROWS.map(r => r[2]))].sort((a, b) => a - b);

// Latest year in dataset
export const LATEST_YEAR = Math.max(...YEARS);

// Earliest year in dataset
export const EARLIEST_YEAR = Math.min(...YEARS);

// Total count of countries
export const TOTAL_COUNTRIES = COUNTRIES.length;

// Total count of distinct regions
export const TOTAL_REGIONS = REGIONS.length;

// ─── KPI values derived from real data ───────────────────────────────────────

// Total emissions in latest year (sum of all countries that have data for latest year, in Mt)
const latestYearRows = RAW_COUNTRY_ROWS.filter(r => r[2] === LATEST_YEAR);
const totalEmissionsLatestYearMt = latestYearRows.reduce((sum, r) => sum + r[3], 0) / 1000;

// Average per-capita across all rows in latest year
const avgPerCapitaLatest = latestYearRows.length > 0
  ? latestYearRows.reduce((sum, r) => sum + r[4], 0) / latestYearRows.length
  : 0;

export const KPI_DATA = {
  totalCountries: {
    value: TOTAL_COUNTRIES.toString(),
    desc: `Unique countries in dataset (${EARLIEST_YEAR}–${LATEST_YEAR})`
  },
  totalRegions: {
    value: TOTAL_REGIONS.toString(),
    desc: `Distinct geographic regions tracked`
  },
  latestDataYear: {
    value: LATEST_YEAR.toString(),
    desc: `Most recent year with data in this dataset`
  },
  avgPerCapita: {
    value: avgPerCapitaLatest.toFixed(2) + " t",
    desc: `Avg. metric tons CO₂ per person (${LATEST_YEAR})`
  },
};

// ─── Global Emissions Trend (aggregated across all countries by year) ─────────

const yearTotals = {};
const yearCounts = {};
YEARS.forEach(y => { yearTotals[y] = 0; yearCounts[y] = 0; });

RAW_COUNTRY_ROWS.forEach(([, , year, kt, perCap]) => {
  yearTotals[year] += kt;
  yearCounts[year] += 1;
});

export const EMISSIONS_TREND = YEARS.map(year => ({
  year,
  // Total in Gt for chart readability (/ 1e6)
  co2: parseFloat((yearTotals[year] / 1e6).toFixed(3)),
  co2PerCapita: parseFloat((yearTotals[year] / yearCounts[year] / 1000).toFixed(3)),
}));

// ─── Regional Aggregates (latest year) ───────────────────────────────────────

const regionMap = {};
latestYearRows.forEach(([, region, , kt, perCap]) => {
  if (!regionMap[region]) regionMap[region] = { totalKt: 0, totalPerCap: 0, count: 0 };
  regionMap[region].totalKt += kt;
  regionMap[region].totalPerCap += perCap;
  regionMap[region].count += 1;
});

export const REGIONAL_DATA = Object.entries(regionMap).map(([region, val]) => ({
  region,
  // co2 in Mt for the bar chart
  co2: parseFloat((val.totalKt / 1000).toFixed(2)),
  co2PerCapita: parseFloat((val.totalPerCap / val.count).toFixed(2)),
})).sort((a, b) => b.co2 - a.co2);

// ─── Country Explorer ─────────────────────────────────────────────────────────

/**
 * Returns all records for a given country, sorted by year ascending.
 * Each record: { year, ktCO2, perCapita }
 */
export function getCountryData(countryName) {
  return RAW_COUNTRY_ROWS
    .filter(r => r[0] === countryName)
    .sort((a, b) => a[2] - b[2])
    .map(([, , year, kt, perCapita]) => ({ year, ktCO2: kt, co2Mt: kt / 1000, perCapita }));
}

/**
 * Latest data point for a country
 */
export function getCountryLatest(countryName) {
  const rows = getCountryData(countryName);
  return rows.length > 0 ? rows[rows.length - 1] : null;
}

// ─── Regional data for all years (for year filter) ───────────────────────────

/**
 * Get regional aggregates for a specific year
 */
export function getRegionalDataForYear(year) {
  const rows = RAW_COUNTRY_ROWS.filter(r => r[2] === year);
  const rMap = {};
  rows.forEach(([, region, , kt, perCap]) => {
    if (!rMap[region]) rMap[region] = { totalKt: 0, totalPerCap: 0, count: 0 };
    rMap[region].totalKt += kt;
    rMap[region].totalPerCap += perCap;
    rMap[region].count += 1;
  });
  return Object.entries(rMap).map(([region, val]) => ({
    region,
    co2: parseFloat((val.totalKt / 1000).toFixed(2)),
    co2PerCapita: parseFloat((val.totalPerCap / val.count).toFixed(2)),
  })).sort((a, b) => b.co2 - a.co2);
}

// ─── India State Data ─────────────────────────────────────────────────────────

export const INDIA_STATE_DATA = RAW_INDIA_ROWS.map(([state, co2, co, ch4]) => ({
  state,
  co2PerCapita: co2,   // kg per person
  coPerCapita: co,     // kg per person
  ch4PerCapita: ch4,   // kg per person
})).sort((a, b) => b.co2PerCapita - a.co2PerCapita);

// ─── Data Sources Info ────────────────────────────────────────────────────────

export const DATA_SOURCES_INFO = [
  {
    name: "Carbon (CO₂) Emissions by Country",
    coverage: `${TOTAL_COUNTRIES} countries · ${TOTAL_REGIONS} regions`,
    reportingPeriod: `${EARLIEST_YEAR} – ${LATEST_YEAR}`,
    metrics: "CO₂ (kilotons) · Metric tons per capita",
    source: "Global Carbon Dataset (CSV)"
  },
  {
    name: "Carbon Emission India – State Level",
    coverage: `${RAW_INDIA_ROWS.length} Indian states`,
    reportingPeriod: "Single period snapshot",
    metrics: "CO₂, CO, CH₄ – all per capita (kg/person)",
    source: "CarbonEmissionIndia Dataset (CSV)"
  }
];
