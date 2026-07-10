import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ApplyPage } from './pages/ApplyPage'
import { HomePage } from './pages/HomePage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { JobSearchPage } from './pages/JobSearchPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
