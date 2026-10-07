import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NAV_SECTIONS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Global', href: '#global-carbon-data' },
  { label: 'India', href: '#india-states' },
  { label: 'Industries', href: '#industries' },
  { label: 'Data', href: '#data-table' },
  { label: 'Sources', href: '#data-sources' },
];

export default function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  const handleToggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    setLogoutError('');
    try {
      await onLogout();
      closeMenu();
      navigate('/');
    } catch (error) {
      setLogoutError(error.message || 'Unable to log out. Please try again.');
    }
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <Link to="/" className="brand" aria-label="TrustCarbon home" onClick={closeMenu}>
          <img className="brand-mark" src="/assets/trustcarbon-fingerprint.png" alt="TrustCarbon logo" />
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
        </nav>

        <div className="nav-actions">
          {logoutError && <span role="alert">{logoutError}</span>}
          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="top-cta" onClick={closeMenu}>
                {isAdmin ? 'Admin / DBA' : 'Personal Dashboard'}
              </Link>
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
