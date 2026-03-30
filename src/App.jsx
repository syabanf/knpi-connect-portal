import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import PublicEventDetail from './pages/PublicEventDetail';
import PublicNewsDetail from './pages/PublicNewsDetail';

// Pages
import Landing from './pages/Landing';
import MemberDashboard from './pages/MemberDashboard';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import DocumentCenter from './pages/DocumentCenter';
import AnnouncementCenter from './pages/AnnouncementCenter';
import Requests from './pages/Requests';
import MemberProfile from './pages/MemberProfile';
import Analytics from './pages/Analytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminRequests from './pages/admin/AdminRequests';
import AdminSettings from './pages/admin/AdminSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/event/:id" element={<PublicEventDetail />} />
      <Route path="/news/:id" element={<PublicNewsDetail />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/documents" element={<DocumentCenter />} />
        <Route path="/announcements" element={<AnnouncementCenter />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/documents" element={<AdminDocuments />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App