import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import SymptomsPage from './pages/SymptomsPage';
import AlertsPage from './pages/AlertsPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('alerts')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_resolved', false)
      .then(({ count }) => setAlertCount(count || 0));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading MindGuard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <Layout alertCount={alertCount}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mood" element={<MoodTracker />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
