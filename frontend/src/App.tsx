/**
 * Main App Component with Routing
 * Enterprise-grade admin panel for InfinityX AI
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { wsService } from './services/websocket';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ProofLogsPage } from './pages/ProofLogsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DemosPage } from './pages/DemosPage';

/**
 * Protected Route wrapper - requires authentication
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * App Routes Component
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Initialize WebSocket connection when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      wsService.connect();
    } else {
      wsService.disconnect();
    }

    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Navigate to="/dashboard" replace />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AgentsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflows"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WorkflowsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AuditLogsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/proofs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProofLogsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OnboardingPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/demos"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DemosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

/**
 * Root App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

