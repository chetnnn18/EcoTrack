import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import ReportWaste from './pages/ReportWaste';
import MyReports from './pages/MyReports';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/report" element={<ReportWaste />} />
      <Route path="/reports" element={<MyReports />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route
      element={
        <ProtectedRoute roles={['admin']}>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/admin" element={<AdminDashboard />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
