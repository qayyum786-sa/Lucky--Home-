import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/common/ErrorBoundary';

import Home           from './pages/Home';
import About          from './pages/About';
import BuyProperties  from './pages/BuyProperties';
import RentProperties from './pages/RentProperties';
import PropertyDetail from './pages/PropertyDetail';
import Contact        from './pages/Contact';

import AdminLogin       from './pages/admin/AdminLogin';
import AdminLayout      from './pages/admin/AdminLayout';
import Dashboard        from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';
import PropertyForm     from './pages/admin/PropertyForm';
import Enquiries        from './pages/admin/Enquiries';
import Users            from './pages/admin/Users';

// Explicit wrapper components — type prop is NEVER undefined this way
const BuyDetail  = () => <ErrorBoundary><PropertyDetail type="buy"  /></ErrorBoundary>;
const RentDetail = () => <ErrorBoundary><PropertyDetail type="rent" /></ErrorBoundary>;
const BuyForm    = () => <ErrorBoundary><PropertyForm   type="buy"  /></ErrorBoundary>;
const RentForm   = () => <ErrorBoundary><PropertyForm   type="rent" /></ErrorBoundary>;
const BuyManage  = () => <ErrorBoundary><ManageProperties type="buy"  /></ErrorBoundary>;
const RentManage = () => <ErrorBoundary><ManageProperties type="rent" /></ErrorBoundary>;

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/"         element={<ErrorBoundary><Home /></ErrorBoundary>} />
          <Route path="/about"    element={<ErrorBoundary><About /></ErrorBoundary>} />
          <Route path="/buy"      element={<ErrorBoundary><BuyProperties /></ErrorBoundary>} />
          <Route path="/buy/:id"  element={<BuyDetail />} />
          <Route path="/rent"     element={<ErrorBoundary><RentProperties /></ErrorBoundary>} />
          <Route path="/rent/:id" element={<RentDetail />} />
          <Route path="/contact"  element={<ErrorBoundary><Contact /></ErrorBoundary>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index                       element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="buy-properties"           element={<BuyManage />} />
            <Route path="buy-properties/new"       element={<BuyForm />} />
            <Route path="buy-properties/edit/:id"  element={<BuyForm />} />
            <Route path="rent-properties"          element={<RentManage />} />
            <Route path="rent-properties/new"      element={<RentForm />} />
            <Route path="rent-properties/edit/:id" element={<RentForm />} />
            <Route path="enquiries" element={<ErrorBoundary><Enquiries /></ErrorBoundary>} />
            <Route path="users"     element={<ErrorBoundary><Users /></ErrorBoundary>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
