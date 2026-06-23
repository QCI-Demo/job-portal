import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import { PrivateRoute } from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'
import { ApplyPage } from './pages/ApplyPage'
import { HomePage } from './pages/HomePage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { JobSearchPage } from './pages/JobSearchPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage'
import { ForbiddenPage } from './pages/admin/ForbiddenPage'
import { JobManagementPage } from './pages/admin/JobManagementPage'
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage'
import { UserManagementPage } from './pages/admin/UserManagementPage'
import { getRolesFromToken, hasRequiredRole } from './utils/jwt'

function AdminJobsRoute() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="px-4 py-16 text-center text-slate-600">
        Checking your session…
      </p>
    )
  }

  const roles = user?.roles ?? getRolesFromToken()
  const isAdmin = isAuthenticated && hasRequiredRole(roles, 'admin')

  if (isAdmin) {
    return (
      <PrivateRoute requiredRole="admin">
        <AdminLayout />
      </PrivateRoute>
    )
  }

  return <JobSearchPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<AdminJobsRoute />}>
          <Route index element={<JobManagementPage />} />
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
  )
}

export default App
