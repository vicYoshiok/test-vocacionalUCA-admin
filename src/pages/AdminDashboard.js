// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/admin/Dashboard';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Obtener datos del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Llamar a la función de logout si existe
    if (onLogout) {
      onLogout();
    }
    
    // Redirigir al login
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Cerrar dropdown si se hace clic fuera de él
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown')) {
      setShowDropdown(false);
    }
  };

  // Agregar event listener para cerrar el dropdown
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-layout">
      {/* Header con información del usuario */}
      <nav className="navbar navbar-light" style={{ backgroundColor: "#ffff", color: "#3498DB" }}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center" style={{ color: "#3498DB" }}>
            <img 
              src="https://www.ucuauhtemoc.edu.mx/hubfs/sitio/generales/universidad-cuauhtemoc-campus-aguascalientes-header-logo.svg" 
              alt="Logo" 
              className="img-fluid me-2" 
              style={{ height: "40px" }} 
            />
            <i className="bi me-2"></i>
            Admin - Test Vocacional
          </span>
          
          {/* Menú de usuario */}
          <div className="d-flex align-items-center">
            {/* Información del usuario */}
            <div className="me-3 text-end d-none d-md-block">
              <div className="fw-bold" style={{ color: "#3498DB", fontSize: "0.9rem" }}>
                {user?.name || 'Usuario'}
              </div>
              <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                {user?.email || 'email@ejemplo.com'}
              </div>
            </div>
            
            {/* Dropdown personalizado para cerrar sesión */}
            <div className="dropdown">
              <button 
                className="btn btn-outline-primary d-flex align-items-center" 
                type="button" 
                onClick={toggleDropdown}
                style={{ 
                  borderColor: "#3498DB", 
                  color: "#3498DB",
                  fontSize: "0.9rem"
                }}
              >
                <i className="bi bi-person-circle me-2"></i>
                <span className="d-none d-sm-inline">Mi Cuenta</span>
                <i className={`bi bi-chevron-down ms-2 ${showDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              
              {/* Menú desplegable */}
              {showDropdown && (
                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 rounded">
                  <div className="dropdown-header text-dark py-2">
                    <small>Sesión activa como:</small>
                    <br />
                    <strong>{user?.name || 'Usuario'}</strong>
                    <br />
                    <small className="text-muted">{user?.email || 'email@ejemplo.com'}</small>
                  </div>
                  <div className="dropdown-divider my-1"></div>
                  <button 
                    className="dropdown-item d-flex align-items-center py-2 text-danger" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
<main className="container-fluid py-4">
  {/* Tarjeta de información del usuario */}
  <div className="row mb-4">
    <div className="col-12">
      <div className="card border-0 shadow-sm">
        <div className="card-header text-white border-0" style={{ backgroundColor: "#3498DB" }}>
          <div className="d-flex align-items-center">
            <i className="bi bi-person-badge me-3 fs-4"></i>
            <div>
              <h5 className="card-title mb-0">¡Hola! {user?.name || 'No disponible'}</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            {/* Información del usuario en una sola fila */}
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3 text-center" style={{ minWidth: "60px" }}>
                  <i className="bi bi-person text-primary fs-4"></i>
                </div>
                <div>
                  <small className="text-muted d-block">Nombre completo</small>
                  <p className="mb-0 fw-bold text-dark fs-6">{user?.name || 'No disponible'}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3 text-center" style={{ minWidth: "60px" }}>
                  <i className="bi bi-envelope text-primary fs-4"></i>
                </div>
                <div>
                  <small className="text-muted d-block">Correo electrónico</small>
                  <p className="mb-0 fw-bold text-dark fs-6">{user?.email || 'No disponible'}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded me-3 text-center" style={{ minWidth: "60px" }}>
                  <i className="bi bi-calendar-check text-info fs-4"></i>
                </div>
                <div>
                  <small className="text-muted d-block">Fecha de ingreso</small>
                  <p className="mb-0 fw-bold text-dark fs-6">
                    {new Date().toLocaleDateString('es-MX', { 
                      day: 'numeric',
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  
  {/* Componente Dashboard */}
  <div className="row">
    <div className="col-12">
      <Dashboard />
    </div>
  </div>
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