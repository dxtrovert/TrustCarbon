import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardDataProvider } from '../../contexts/DashboardDataContext';
import { CorporateIntelligenceProvider } from '../../contexts/CorporateIntelligenceContext';
import { useDashboardData } from '../../hooks/useDashboardData';

const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [{ label: 'Overview', path: '/', icon: '◈', end: true }],
  },
  {
    title: 'EXPLORE',
    items: [
      { label: 'Global Explorer', path: '/explore/global', icon: '◎' },
      { label: 'India Intelligence', path: '/explore/india', icon: '⌖' },
      { label: 'Industries', path: '/explore/industries', icon: '▥' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Analysis Engine', path: '/intelligence/analysis', icon: '⌁' },
      { label: 'Anomalies', path: '/intelligence/anomalies', icon: '⌁' },
      { label: 'Carbon Insights', path: '/intelligence/insights', icon: '◌' },
      { label: 'What-If Simulator', path: '/intelligence/simulator', icon: '↗' },
      { label: 'Carbon Time Machine', path: '/intelligence/time-machine', icon: '◷' },
    ],
  },
  {
    title: 'CORPORATE',
    items: [
      { label: 'Company Monitor', path: '/corporate/monitor', icon: '▤' },
      { label: 'BRSR', path: '/corporate/brsr', icon: '▧' },
      { label: 'Compliance Radar', path: '/corporate/compliance', icon: '◉' },
      { label: 'Green Credit', path: '/corporate/green-credit', icon: '✳' },
    ],
  },
  {
    title: 'DATA',
    items: [
      { label: 'Data Sources', path: '/data/sources', icon: '◫' },
      { label: 'Trust Scores', path: '/data/trust-scores', icon: '◇' },
    ],
  },
];

const TITLES = Object.fromEntries(NAV_GROUPS.flatMap((group) => group.items.map((item) => [item.path, item.label])));

function DashboardWorkspace() {
  const { user, profile, signOut } = useAuth();
  const { years, selectedYear, setSelectedYear, playing, setPlaying } = useDashboardData();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState('');
  const currentTitle = TITLES[location.pathname] || 'Overview';

  const handleSignOut = async () => {
    setLogoutError('');
    try {
      await signOut();
    } catch (error) {
      setLogoutError(error.message || 'Unable to sign out. Please try again.');
    }
  };

  return (
    <div className="tc-shell">
      <aside className="tc-sidebar">
        <Link to="/" className="tc-brand" aria-label="TrustCarbon overview">
          <span className="tc-brand-mark"><img src="/assets/trustcarbon-fingerprint.png" alt="" /></span>
          <span><strong>TRUSTCARBON</strong><small>CLIMATE INTELLIGENCE</small></span>
        </Link>

        <nav className="tc-navigation" aria-label="Dashboard navigation">
          {NAV_GROUPS.map((group) => (
            <section className="tc-nav-group" key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `tc-nav-link${isActive ? ' active' : ''}`}
                >
                  <span className="tc-nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>

        <div className="tc-sidebar-foot">
          <div className="tc-data-status"><i /> Historical data workspace</div>
          <div className="tc-account">
            {user ? (
              <>
                <span className="tc-avatar">{(profile?.full_name || user.email || 'T').slice(0, 1).toUpperCase()}</span>
                <span className="tc-account-name"><strong>{profile?.full_name || user.email}</strong><small>{profile?.role === 'admin' ? 'Administrator' : 'Account'}</small></span>
                <button type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out">↗</button>
              </>
            ) : (
              <Link to="/login" className="tc-sign-in">Sign in to your account <span>→</span></Link>
            )}
          </div>
          {logoutError && <p className="tc-inline-error" role="alert">{logoutError}</p>}
          {user && (
            <div className="tc-account-links">
              <Link to="/dashboard">Personal dashboard</Link>
              {profile?.role === 'admin' && <Link to="/admin">Dataset administration</Link>}
            </div>
          )}
          <p className="tc-sidebar-legal">Historical data · Sources cited in context</p>
        </div>
      </aside>

      <div className="tc-workspace">
        <header className="tc-topbar">
          <div className="tc-breadcrumb"><span>TRUSTCARBON</span><b>/</b><strong>{currentTitle}</strong></div>
          <div className="tc-topbar-meta">
            {years.length > 0 && (
              <div className="tc-global-year-control">
                <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause historical year playback' : 'Play historical year playback'}>{playing ? 'Ⅱ' : '▶'}</button>
                <span>{years[0]}</span>
                <input
                  type="range"
                  aria-label="Selected historical year"
                  min="0"
                  max={years.length - 1}
                  value={Math.max(0, years.indexOf(selectedYear))}
                  onChange={(event) => setSelectedYear(years[Number(event.target.value)])}
                />
                <strong>{selectedYear ?? years.at(-1)}</strong>
              </div>
            )}
            <span className="tc-history-indicator"><i /> HISTORICAL</span>
          </div>
        </header>
        <div className="tc-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell() {
  return (
    <DashboardDataProvider>
      <CorporateIntelligenceProvider>
        <DashboardWorkspace />
      </CorporateIntelligenceProvider>
    </DashboardDataProvider>
  );
}
