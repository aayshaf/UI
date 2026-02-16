import { useState, useEffect } from 'react';
import { 
  HashRouter as Router,
  Routes, 
  Route, 
  Navigate, 
  Outlet 
} from 'react-router-dom';
import type { User } from './types';
import { AppContext, useApp } from './context';

// Components
import HomePage from './components/HomePage';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';
import RegisterCustomer from './components/RegisterCustomer';
import RegisterStaff from './components/RegisterStaff';
import RegisterAdmin from './components/RegisterAdmin';
import OTPVerification from './components/OTPVerification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Services from './components/Services';
import ServiceDetails from './components/ServiceDetails';
import Booking from './components/Booking';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import PaymentPage from './components/PaymentPage';
import PaymentGatewayPage from './components/PaymentGatewayPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import Reviews from './components/Reviews';
import TrackingPage from './components/TrackingPage';
import Invoice from './components/Invoice';
import UserProfile from './components/UserProfile';
import ProfileModal from './components/ProfileModal';
import SecuritySettings from './components/SecuritySettings';
import LoyaltyPage from './components/LoyaltyPage';
import VerificationSuccess from './components/VerificationSuccess';
import InventoryListPage from './components/admin/InventoryListPage';
import AddEditInventoryItem from './components/admin/AddEditInventoryItem';
import LowStockAlertsPage from './components/admin/LowStockAlertsPage';
import RestockPage from './components/admin/RestockPage';
import InventoryReportsPage from './components/admin/InventoryReportsPage';
import StaffPerformance from './components/StaffPerformance';
import GPSTracking from './components/GPSTracking';
import CompleteServiceForm from './components/staff/CompleteServiceForm';
import SubmissionSuccess from './components/staff/SubmissionSuccess';

function AppLayout() {
  const { user, showProfileModal, setShowProfileModal, theme, handleLogout } = useApp();
  
  return (
    <>
      {user && (
        <ProfileModal
          user={user}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          theme={theme}
        />
      )}
      <Outlet />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      theme, 
      setTheme, 
      handleLogout, 
      showProfileModal, 
      setShowProfileModal 
    }}>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={
              <HomePage 
                user={user} 
                onLogout={handleLogout} 
                theme={theme} 
                onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                onProfileClick={() => setShowProfileModal(true)} 
              />
            } />
            <Route path="login" element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/dashboard'} replace />
              ) : (
                <Login onLogin={handleLogin} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
              )
            } />
            <Route path="register" element={<RoleSelection />} />
            <Route path="role-selection" element={<RoleSelection />} />
            <Route path="register/customer" element={<RegisterCustomer />} />
            <Route path="register/staff" element={<RegisterStaff />} />
            <Route path="register/admin" element={<RegisterAdmin />} />
            <Route path="otp-verify" element={<OTPVerification onVerify={handleLogin} />} />
            <Route path="verify-success" element={<VerificationSuccess />} />
            <Route path="services" element={<Services user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} />} />
            <Route path="services/:id" element={<ServiceDetails user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />} />
            <Route path="booking/:serviceId" element={user ? <Booking user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="payment" element={user ? <PaymentPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="payment-gateway" element={user ? <PaymentGatewayPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="payment-success" element={user ? <PaymentSuccessPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="tracking/:bookingId" element={user ? <TrackingPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="reviews/:serviceId" element={<Reviews user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} />} />
            <Route path="dashboard" element={user && user.role === 'customer' ? <CustomerDashboard user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} /> : <Navigate to="/login" replace />} />
            <Route path="admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="staff" element={user && user.role === 'staff' ? <StaffDashboard user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="performance" element={user && user.role === 'staff' ? <StaffPerformance user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="gps-tracking" element={user && user.role === 'staff' ? <GPSTracking user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="staff/complete-service/:bookingId?" element={user && user.role === 'staff' ? <CompleteServiceForm /> : <Navigate to="/login" replace />} />
            <Route path="staff/submission-success" element={user && user.role === 'staff' ? <SubmissionSuccess /> : <Navigate to="/login" replace />} />
            <Route path="invoice/:bookingId" element={user ? <Invoice user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="profile" element={user ? <UserProfile user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="security" element={user ? <SecuritySettings user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="loyalty" element={user ? <LoyaltyPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory" element={user && user.role === 'admin' ? <InventoryListPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory/add" element={user && user.role === 'admin' ? <AddEditInventoryItem user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory/edit/:id" element={user && user.role === 'admin' ? <AddEditInventoryItem user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory/low-stock" element={user && user.role === 'admin' ? <LowStockAlertsPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory/restock/:id?" element={user && user.role === 'admin' ? <RestockPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/inventory/reports" element={user && user.role === 'admin' ? <InventoryReportsPage user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/staff-performance" element={user && user.role === 'admin' ? <StaffPerformance user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
            <Route path="admin/gps-tracking" element={user && user.role === 'admin' ? <GPSTracking user={user} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} onProfileClick={() => setShowProfileModal(true)} /> : <Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}