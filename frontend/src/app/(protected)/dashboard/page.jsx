
import React from 'react';
import DashboardPage from '@/pages/DashboardPage'; // Migrating wrapper

// Wrapper for the dashboard to enforce auth (if not already handled)
// and provide app-specific context
const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
