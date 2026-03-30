import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import NavBar from './NavBar';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import TrainerSidebar from './TrainerSidebar';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import HydrationPage from './HydrationPage';
import HealthyFoodPage from './HealthyFoodPage';
import BreathingPage from './BreathingPage';
import YogaPage from './YogaPage';
import WalkingPage from './WalkingPage';
import BMICalculator from './BMICalculator';
import ViewTrainers from './ViewTrainers';
import DietPage from './DietPage';
import HealthBlog from './HealthBlog';
import BlogDetail from './BlogDetail';
import BlogEditor from './BlogEditor';
import MatchingSystem from './MatchingSystem';
import Messages from './Messages';
import './index.css';

import AdminSidebar from './AdminSidebar';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'trainer') {
    return (
      <div className="trd-page">
        <TrainerSidebar />
        <main className="trd-main">
          {children}
        </main>
      </div>
    );
  }
  if (user?.role === 'admin') {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    );
  }
  return (
    <div className="wn-app-layout">
      <NavBar />
      <main className="wn-app-main">
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const TrainerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'trainer') return <Navigate to="/dashboard" replace />;
  return <MainLayout>{children}</MainLayout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/trainer-dashboard" element={<TrainerRoute><TrainerDashboard /></TrainerRoute>} />
      <Route path="/hydration"       element={<ProtectedRoute><HydrationPage /></ProtectedRoute>} />
      <Route path="/healthy-food"    element={<ProtectedRoute><HealthyFoodPage /></ProtectedRoute>} />
      <Route path="/breathing"       element={<ProtectedRoute><BreathingPage /></ProtectedRoute>} />
      <Route path="/yoga"            element={<ProtectedRoute><YogaPage /></ProtectedRoute>} />
      <Route path="/walking"         element={<ProtectedRoute><WalkingPage /></ProtectedRoute>} />
      {/* New pages */}
      <Route path="/bmi"             element={<ProtectedRoute><BMICalculator /></ProtectedRoute>} />
      <Route path="/trainers"        element={<ProtectedRoute><ViewTrainers /></ProtectedRoute>} />
      <Route path="/diet"             element={<ProtectedRoute><DietPage /></ProtectedRoute>} />
      <Route path="/blog"            element={<ProtectedRoute><HealthBlog /></ProtectedRoute>} />
      <Route path="/blog/:id"        element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
      <Route path="/blog/new"        element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
      <Route path="/blog/edit/:id"   element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
      <Route path="/matcher"         element={<ProtectedRoute><MatchingSystem /></ProtectedRoute>} />
      <Route path="/messages"        element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/"                element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
