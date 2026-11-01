import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import UploadDocument from './pages/student/UploadDocument';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/student/StudentHome';
import Forbidden from './pages/Forbidden';
import AdminApplications from './pages/admin/AdminApplications';
import AdminCompleted from './pages/admin/AdminCompleted';
import DatasetUpload from './pages/admin/DatasetUpload';
import ReportPage from './pages/student/ReportPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forbidden" element={<Forbidden />} />

  <Route
    path="/student"
    element={
      <ProtectedRoute role="ROLE_STUDENT">
        <StudentHome />
      </ProtectedRoute>
    }
  />
  <Route
    path="/student/upload"
    element={
      <ProtectedRoute role="ROLE_STUDENT">
        <UploadDocument />
      </ProtectedRoute>
    }
  />
  <Route
  path="/admin"
  element={
    <ProtectedRoute role="ROLE_ADMIN">
      <AdminApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/completed"
  element={
    <ProtectedRoute role="ROLE_ADMIN">
      <AdminCompleted />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/dataset"
  element={
    <ProtectedRoute role="ROLE_ADMIN">
      <DatasetUpload />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/report/:id"
  element={
    <ProtectedRoute role="ROLE_STUDENT">
      <ReportPage />
    </ProtectedRoute>
  }
/>

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}