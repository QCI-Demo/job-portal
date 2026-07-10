import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminWireframeLayout } from './components/admin/AdminWireframeLayout'
import { EmployerWireframeLayout } from './components/employer/EmployerWireframeLayout'
import { ApplyPage } from './pages/ApplyPage'
import { HomePage } from './pages/HomePage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { JobSearchPage } from './pages/JobSearchPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminCategoriesPage } from './pages/wireframes/admin/AdminCategoriesPage'
import { AdminJobsPage } from './pages/wireframes/admin/AdminJobsPage'
import { AdminOverviewPage } from './pages/wireframes/admin/AdminOverviewPage'
import { AdminSettingsPage } from './pages/wireframes/admin/AdminSettingsPage'
import { AdminUsersPage } from './pages/wireframes/admin/AdminUsersPage'
import { EmployerApplicationDetailPage } from './pages/wireframes/employer/EmployerApplicationDetailPage'
import { EmployerApplicationsPage } from './pages/wireframes/employer/EmployerApplicationsPage'
import { EmployerJobFormPage } from './pages/wireframes/employer/EmployerJobFormPage'
import { EmployerJobsPage } from './pages/wireframes/employer/EmployerJobsPage'
import { EmployerOverviewPage } from './pages/wireframes/employer/EmployerOverviewPage'
import { WireframeIndexPage } from './pages/wireframes/WireframeIndexPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/profile" element={<ProfilePage />} />

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
  )
}

export default App
