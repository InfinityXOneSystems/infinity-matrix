
import React from 'react';
import Layout from '@/components/Layout'; // Re-using existing Layout component as the wrapper
import { Toaster } from '@/components/ui/toaster';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { logger } from '@/app/lib/logger';

// Root Layout following App Router pattern
// In Next.js this would be app/layout.js, here it wraps our Routes
const RootLayout = ({ children }) => {
  React.useEffect(() => {
    logger.info('Application mounted', { event: 'app_start' });
  }, []);

  return (
    <>
      <Layout />
      <Toaster />
      <PWAInstallPrompt />
    </>
  );
};

export default RootLayout;
