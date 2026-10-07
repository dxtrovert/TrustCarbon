import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NAV_SECTIONS = [
  { label: 'Global Data', href: '#global-carbon-data' },
  { label: 'Regional', href: '#regional-analysis' },
  { label: 'Countries', href: '#country-explorer' },
  { label: 'India States', href: '#india-states' },
  { label: 'Data Table', href: '#data-table' },
  { label: 'Sources', href: '#data-sources' },
];

export default function Navbar({ isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
    closeMenu();
    navigate('/');
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    closeMenu();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <Link to="/" className="brand" aria-label="TrustCarbon home" onClick={closeMenu}>
          <svg className="brand-mark" viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
            <circle cx="20" cy="20" r="17.5" fill="none" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M20 6 A14 14 0 0 1 30 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M13 21c2-5 6-8 11-8-1 5-4 9-9 10-3 .7-5-.4-2-2z" fill="currentColor"/>
          </svg>
          <div className="brand-text">
            <span className="brand-name">TrustCarbon</span>
            <span className="brand-tagline">Measure. Reduce. Sustain.</span>
          </div>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
          {NAV_SECTIONS.map(s => (
            <a
              key={s.href}
              href={s.href}
              onClick={(e) => scrollToSection(e, s.href)}
            >
              {s.label}
            </a>
          ))}

          {/* Mobile-only auth */}
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="mobile-only" onClick={closeMenu} style={{ display: 'none' }}>Dashboard</Link>
              <a href="#logout" className="mobile-only" onClick={handleLogoutClick} style={{ display: 'none' }}>Logout</a>
            </>
          ) : (
            <Link to="/login" className="mobile-only" onClick={closeMenu} style={{ display: 'none' }}>Login</Link>
          )}
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="top-cta" onClick={closeMenu}>Dashboard</Link>
              <button
                className="profile-btn"
                onClick={handleLogoutClick}
                title="Log Out"
                aria-label="Account Log Out"
              >
                ●
              </button>
            </>
          ) : (
            <Link to="/login" className="top-cta" onClick={closeMenu}>Login</Link>
          )}

          <button
            className={`menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={handleToggleMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
