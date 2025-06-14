import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import AddDonation from './components/AddDonation';
import BrowseSupplies from './components/supplies/BrowseSupplies';
import MyDonation from './components/mydonation';
import MyRequest from './components/myrequest';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-donation"
              element={
                <ProtectedRoute>
                  <AddDonation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/supplies"
              element={
                <ProtectedRoute>
                  <BrowseSupplies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-donations"
              element={
                <ProtectedRoute>
                  <MyDonation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-request"
              element={
                <ProtectedRoute>
                  <MyRequest />
                </ProtectedRoute>
              }
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;