import React from 'react';
import SectionHeading from './SectionHeading';

export default function FeatureCards() {
  const features = [
    {
      index: "01",
      title: "Collect",
      desc: "Bring carbon data together from different sources and reporting systems.",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '16px' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="13" x2="15" y2="13"/>
          <line x1="9" y1="17" x2="13" y2="17"/>
        </svg>
      )
    },
    {
      index: "02",
      title: "Analyze",
      desc: "Understand emissions trends, patterns, and changes over time.",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '16px' }}>
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    {
      index: "03",
      title: "Compare",
      desc: "Compare countries, regions, industries, and other entities using consistent metrics.",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '16px' }}>
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/>
          <path d="M18 8h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1"/>
        </svg>
      )
    },
    {
      index: "04",
      title: "Act",
      desc: "Turn emissions insights into better decisions and reduction strategies.",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', marginBottom: '16px' }}>
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      )
    }
  ];

  return (
    <section className="features">
      <SectionHeading 
        title="Everything you need to understand carbon data." 
        subtitle="Explore emissions, compare regions, understand trends, and identify where action matters most."
      />

      <div className="feature-row">
        {features.map((feature, idx) => (
          <article className="feature-block" key={idx}>
            <span className="feature-index">{feature.index}</span>
            {feature.icon}
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
