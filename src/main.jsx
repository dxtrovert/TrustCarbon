import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './styles/global.css';
import './styles/dashboard.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary><App /></ErrorBoundary>
    </AuthProvider>
  </StrictMode>,
)
