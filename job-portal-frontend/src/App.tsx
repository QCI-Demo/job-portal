import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AdminWireframeLayout } from './components/admin/AdminWireframeLayout';
import { EmployerLayout } from './components/employer/EmployerLayout';
import { EmployerWireframeLayout } from './components/employer/EmployerWireframeLayout';
import { EmployerRoute } from './components/EmployerRoute';
import { useAuth } from './context/AuthContext';
import { ApplyPage } from './pages/ApplyPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { HomePage } from './pages/HomePage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { JobSearchPage } from './pages/JobSearchPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ApplicationsPage } from './pages/employer/ApplicationsPage';
import { JobFormPage } from './pages/employer/JobFormPage';
import { JobListPage } from './pages/employer/JobListPage';
import { AdminCategoriesPage } from './pages/wireframes/admin/AdminCategoriesPage';
import { AdminJobsPage } from './pages/wireframes/admin/AdminJobsPage';
import { AdminOverviewPage } from './pages/wireframes/admin/AdminOverviewPage';
import { AdminSettingsPage } from './pages/wireframes/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/wireframes/admin/AdminUsersPage';
import { EmployerApplicationDetailPage } from './pages/wireframes/employer/EmployerApplicationDetailPage';
import { EmployerApplicationsPage } from './pages/wireframes/employer/EmployerApplicationsPage';
import { EmployerJobFormPage } from './pages/wireframes/employer/EmployerJobFormPage';
import { EmployerJobsPage } from './pages/wireframes/employer/EmployerJobsPage';
import { EmployerOverviewPage } from './pages/wireframes/employer/EmployerOverviewPage';
import { WireframeIndexPage } from './pages/wireframes/WireframeIndexPage';
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
    isEmployer: isAuthenticated && hasRequiredRole(roles, 'employer'),
  };
}

function JobsRouteLayout() {
  const { loading, isEmployer } = useResolvedRoles();
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

  return <Outlet />;
}

function JobsIndexPage() {
  const { loading, isEmployer } = useResolvedRoles();

  if (loading) {
    return <SessionLoading />;
  }

  if (isEmployer) {
    return <JobListPage />;
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

        <Route path="/wireframes" element={<WireframeIndexPage />} />

        <Route path="/admin" element={<AdminWireframeLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/employer" element={<EmployerWireframeLayout />}>
          <Route index element={<EmployerOverviewPage />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="jobs/new" element={<EmployerJobFormPage />} />
          <Route path="jobs/:id/edit" element={<EmployerJobFormPage />} />
          <Route path="applications" element={<EmployerApplicationsPage />} />
          <Route path="applications/:id" element={<EmployerApplicationDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
