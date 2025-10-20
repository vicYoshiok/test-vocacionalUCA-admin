// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from "./components/LoginPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/admin" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/admin"
            element={user ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/AdminDashboard"
            element={user ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          {/* Ruta por defecto */}
          <Route
            path="/"
            element={<Navigate to={user ? "/admin" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/admin" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;