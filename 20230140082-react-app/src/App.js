import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';

function App() {
  const token = localStorage.getItem('token');

  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch (e) {
    localStorage.removeItem('token');
    user = null;
  }

  const isAuthenticated = !!user;

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />

          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/presensi"
            element={isAuthenticated ? <PresensiPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/reports"
            element={
              isAuthenticated && user && user.role === 'admin'
                ? <ReportPage />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
