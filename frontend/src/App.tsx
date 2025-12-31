import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { ChatPage } from './pages/ChatPage';
import { wsService } from './services/websocket';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { token } = useAuthStore();

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect(token || undefined);

    return () => {
      wsService.disconnect();
    };
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="data-sources" element={<DashboardPage />} />
            <Route path="monitor" element={<DashboardPage />} />
            <Route path="github" element={<DashboardPage />} />
            <Route path="users" element={<DashboardPage />} />
            <Route path="settings" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
