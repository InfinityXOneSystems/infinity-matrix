
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '@/app/layout';

// New App Structure Imports
import HomePage from '@/app/(public)/page';
import TechPage from '@/app/(public)/technology/page';
import PricingPage from '@/app/(public)/pricing/page';
import SignInPage from '@/app/(auth)/sign-in/page';
import AdminPage from '@/app/(protected)/admin/page';
import Dashboard from '@/app/(protected)/dashboard/page';
import AgentBuilder from '@/app/(protected)/tools/agent-builder/page';

// Marketing Pages for Tools
import { 
  VisionCortexPage, 
  QuantumXPage, 
  PredictPage, 
  SimulatePage, 
  InfinityCoinPage,
  AgentBuilderPage
} from '@/app/(public)/marketing/tool-pages';

// Legacy Tools & Pages
import {
  VisionCortexTool,
  QuantumXTool,
  PredictTool,
  SimulateTool,
  InfinityCoinTool
} from '@/app/(protected)/tools/tool-apps';

import ProtectedRoute from '@/components/ProtectedRoute';
import { AdminProvider } from '@/lib/AdminProvider.jsx';
import { AuthProvider } from '@/lib/AuthContext.jsx';
import { SyncProvider } from '@/lib/SyncProvider.jsx';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <SyncProvider>
            <AdminProvider>
              <Routes>
                
                <Route element={<RootLayout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/technology" element={<TechPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  
                  {/* Tool Marketing Pages */}
                  <Route path="/vision-cortex" element={<VisionCortexPage />} />
                  <Route path="/quantum-x-builder" element={<QuantumXPage />} />
                  <Route path="/predict" element={<PredictPage />} />
                  <Route path="/simulate" element={<SimulatePage />} />
                  <Route path="/infinity-coin" element={<InfinityCoinPage />} />
                  <Route path="/agent-builder" element={<AgentBuilderPage />} />

                  {/* Protected Dashboard */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Auth Routes */}
                <Route path="/auth" element={<SignInPage />} />
                <Route path="/sign-in" element={<SignInPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                } />

                {/* Tool Routes (Protected Apps) */}
                <Route path="/app/agent-builder" element={
                  <ProtectedRoute>
                    <AgentBuilder />
                  </ProtectedRoute>
                } />
                <Route path="/app/vision-cortex" element={<VisionCortexTool />} />
                <Route path="/app/quantum-x-builder" element={<QuantumXTool />} />
                <Route path="/app/predict" element={<PredictTool />} />
                <Route path="/app/simulate" element={<SimulateTool />} />
                <Route path="/app/infinity-coin" element={<InfinityCoinTool />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </AdminProvider>
          </SyncProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
