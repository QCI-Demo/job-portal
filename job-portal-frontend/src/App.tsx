import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout } from './components/admin/AdminLayout';
import { EmployerLayout } from './components/employer/EmployerLayout';
import { EmployerRoute } from './components/EmployerRoute';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { ApplyPage } from './pages/ApplyPage';
import { HomePage } from './pages/HomePage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { JobSearchPage } from './pages/JobSearchPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage';
import { ForbiddenPage } from './pages/admin/ForbiddenPage';
import { JobManagementPage } from './pages/admin/JobManagementPage';
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { ApplicationsPage } from './pages/employer/ApplicationsPage';
import { JobFormPage } from './pages/employer/JobFormPage';
import { JobListPage } from './pages/employer/JobListPage';
import { getRolesFromToken, hasRequiredRole } from './utils/jwt';

function SessionLoading() {
  return (
    <p role="status" aria-live="polite" className="px-4 py-16 text-center text-slate-600">
      Checking your session…
    </p>
  );
}

function useResolvedRoles() {
  const { user, loading, isAuthenticated } = useAuth();
  const roles = user?.roles ?? getRolesFromToken();

  return {
    loading,
    isAuthenticated,
    isAdmin: isAuthenticated && hasRequiredRole(roles, 'admin'),
    isEmployer: isAuthenticated && hasRequiredRole(roles, 'employer'),
  };
}

function JobsRouteLayout() {
  const { loading, isAdmin, isEmployer } = useResolvedRoles();
  const location = useLocation();
  const isEmployerOnlyPath =
    location.pathname === '/jobs/new' || /^\/jobs\/[^/]+\/edit$/.test(location.pathname);

  if (loading) {
    return <SessionLoading />;
  }

  if (isEmployerOnlyPath || isEmployer) {
    return (
      <EmployerRoute>
        <EmployerLayout />
      </EmployerRoute>
    );
  }

  if (isAdmin) {
    return (
      <PrivateRoute requiredRole="admin">
        <AdminLayout />
      </PrivateRoute>
    );
  }

  return <Outlet />;
}

function JobsIndexPage() {
  const { loading, isAdmin, isEmployer } = useResolvedRoles();

  if (loading) {
    return <SessionLoading />;
  }

  if (isEmployer) {
    return <JobListPage />;
  }

  if (isAdmin) {
    return <JobManagementPage />;
  }

  return <JobSearchPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsRouteLayout />}>
          <Route index element={<JobsIndexPage />} />
          <Route path="new" element={<JobFormPage />} />
          <Route path=":id/edit" element={<JobFormPage />} />
        </Route>
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route
          element={
            <EmployerRoute>
              <EmployerLayout />
            </EmployerRoute>
          }
        >
          <Route path="/applications" element={<ApplicationsPage />} />
        </Route>

        <Route
          element={
            <PrivateRoute requiredRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/categories" element={<CategoryManagementPage />} />
          <Route path="/settings" element={<SiteSettingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
