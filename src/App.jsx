import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useAuth } from './hooks/useAuth';
import DashboardShell from './components/layout/DashboardShell';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OverviewPanel = lazy(() => import('./pages/OverviewPanel'));
const GlobalExplorerPanel = lazy(() => import('./pages/GlobalExplorerPanel'));
const IndiaIntelligencePanel = lazy(() => import('./pages/IndiaIntelligencePanel'));
const IndustryPanel = lazy(() => import('./pages/IndustryPanel'));
const DataSources = lazy(() => import('./components/DataSources'));
const AnomaliesPanel = lazy(() => import('./pages/AnomaliesPanel'));
const InsightsPanel = lazy(() => import('./pages/InsightsPanel'));
const SimulatorPanel = lazy(() => import('./pages/SimulatorPanel'));
const TimeMachinePanel = lazy(() => import('./pages/TimeMachinePanel'));
const TrustScoresPanel = lazy(() => import('./pages/TrustScoresPanel'));
const AnalysisEnginePanel = lazy(() => import('./pages/AnalysisEnginePanel'));
const CompanyMonitorPanel = lazy(() => import('./pages/CompanyMonitorPanel'));
const BRSRPanel = lazy(() => import('./pages/BRSRPanel'));
const ComplianceRadarPanel = lazy(() => import('./pages/ComplianceRadarPanel'));
const GreenCreditPanel = lazy(() => import('./pages/GreenCreditPanel'));

function ProtectedRoute({ role, children }) {
  const { user, profile, loading, error } = useAuth();
  if (loading) return <div className="page-container" role="status">Restoring your session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (error || !profile) {
    return <div className="page-container" role="alert">
      {error || 'Your account profile could not be loaded. Please sign out and try again.'}
    </div>;
  }
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const dashboardPath = location.pathname === '/'
    || location.pathname.startsWith('/explore/')
    || location.pathname.startsWith('/intelligence/')
    || location.pathname.startsWith('/corporate/')
    || location.pathname.startsWith('/data/');

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">Skip to content</a>
      {!dashboardPath && <Navbar isLoggedIn={Boolean(user)} isAdmin={profile?.role === 'admin'} onLogout={signOut} />}
      <main id="main-content">
        <Suspense fallback={<div className="page-container" role="status">Opening TrustCarbon workspace…</div>}>
          <Routes>
            <Route path="/" element={<DashboardShell />}>
              <Route index element={<OverviewPanel />} />
              <Route path="explore/global" element={<GlobalExplorerPanel />} />
              <Route path="explore/india" element={<IndiaIntelligencePanel />} />
              <Route path="explore/industries" element={<IndustryPanel />} />
              <Route path="data/sources" element={<DataSources />} />
              <Route path="intelligence/analysis" element={<AnalysisEnginePanel />} />
              <Route path="intelligence/anomalies" element={<AnomaliesPanel />} />
              <Route path="intelligence/insights" element={<InsightsPanel />} />
              <Route path="intelligence/simulator" element={<SimulatorPanel />} />
              <Route path="intelligence/time-machine" element={<TimeMachinePanel />} />
              <Route path="corporate/monitor" element={<CompanyMonitorPanel />} />
              <Route path="corporate/brsr" element={<BRSRPanel />} />
              <Route path="corporate/compliance" element={<ComplianceRadarPanel />} />
              <Route path="corporate/green-credit" element={<GreenCreditPanel />} />
              <Route path="data/trust-scores" element={<TrustScoresPanel />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!dashboardPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
