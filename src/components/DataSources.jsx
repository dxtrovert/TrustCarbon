import { DATA_SOURCES_INFO } from '../data/realData';

export default function DataSources() {
  return (
    <section className="sources-section">
      <div className="industry-intro">
        <span className="section-index">DOCUMENTATION / 05</span>
        <h2>Sources and methodology</h2>
        <p>
          Public figures on this site come from the checked-in source files. We
          do not combine private submissions with public records.
        </p>
      </div>

      <div className="sources-grid">
        {DATA_SOURCES_INFO.map((source) => (
          <article className="source-card" key={source.name}>
            <h3>{source.name}</h3>
            <dl className="source-details">
              <div className="source-detail"><dt>Coverage</dt><dd>{source.coverage}</dd></div>
              <div className="source-detail"><dt>Reporting period</dt><dd>{source.reportingPeriod}</dd></div>
              <div className="source-detail"><dt>Metrics and units</dt><dd>{source.metrics}</dd></div>
              <div className="source-detail"><dt>File</dt><dd>{source.source}</dd></div>
            </dl>
          </article>
        ))}
        <article className="source-card demo-source-card">
          <h3>Industry emissions demonstration data</h3>
          <dl className="source-details">
            <div className="source-detail"><dt>Coverage</dt><dd>Six sectors, 2010 to 2024</dd></div>
            <div className="source-detail"><dt>Metrics and units</dt><dd>Illustrative CO₂ values, million tonnes</dd></div>
            <div className="source-detail"><dt>File</dt><dd>industry_demo.csv</dd></div>
            <div className="source-detail"><dt>Status</dt><dd>Demo data, pending verified source</dd></div>
          </dl>
        </article>
      </div>

      <div className="methodology-grid">
        <article>
          <span className="section-index">01 / MEASURE</span>
          <h3>What the figures describe</h3>
          <p>CO₂ is carbon dioxide. Country emissions are presented in kilotonnes in the source file and converted to megatonnes for charts and tables. Per-capita figures are carried over from source records. TrustCarbon does not recalculate them using an assumed population value.</p>
        </article>
        <article>
          <span className="section-index">02 / CHECK</span>
          <h3>Validation and review</h3>
          <p>Uploaded CSV files are checked for expected columns, usable years, missing values, numeric and non-negative emissions, and duplicate location-year rows. Unusual magnitudes are flagged for DBA review rather than silently removed. The DBA can inspect the source, methodology, CSV structure, and values, then approve or reject with a reason.</p>
        </article>
        <article>
          <span className="section-index">03 / PUBLISH</span>
          <h3>Submission is not publication</h3>
          <p>Submissions remain private to their uploader and TrustCarbon reviewers. Approval makes a submission eligible for a separately reviewed publication step. Approval alone does not change public charts or official datasets.</p>
        </article>
        <article>
          <span className="section-index">04 / INTERPRET</span>
          <h3>Demo and verified figures</h3>
          <p>The industry chart uses an illustrative demonstration file, not verified measurements. Its values and shares are visibly labelled as demo data and must not be treated as official TrustCarbon figures. Country and India per-capita values are reported as supplied; no population-based calculations are inferred.</p>
        </article>
      </div>
    </section>
  );
}
