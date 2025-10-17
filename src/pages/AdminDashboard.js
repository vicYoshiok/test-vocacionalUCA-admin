// src/pages/AdminDashboard.js
import React from 'react';
import Dashboard from '../components/admin/Dashboard';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      {/* Header simple del admin */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-speedometer2 me-2"></i>
            Admin - Test Vocacional
          </span>
          <div className="navbar-nav">
              
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <small>
            Panel Administrativo - Test Vocacional &copy; {new Date().getFullYear()}
          </small>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;