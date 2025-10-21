import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/admin/Dashboard';
import RegistroUsuario from '../components/RegistroUsuario';
import { adminAPI } from '../services/api';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false); // Para mostrar/ocultar la lista
  
  // Obtener datos del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Cargar lista de administradores
  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Error cargando administradores:', error);
      alert('Error al cargar la lista de administradores');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar administrador
  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al administrador "${adminName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteAdmin(adminId);
      alert('Administrador eliminado exitosamente');
      loadAdmins(); // Recargar la lista
    } catch (error) {
      console.error('Error eliminando administrador:', error);
      alert(error.message || 'Error al eliminar el administrador');
    }
  };

  useEffect(() => {
    if (showAdmins) {
      loadAdmins();
    }
  }, [showAdmins]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    if (onLogout) {
      onLogout();
    }
    
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown')) {
      setShowDropdown(false);
    }
  };

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
            
            {/* Botón para mostrar/ocultar lista de admins */}
            <button 
              className="btn btn-info me-2 d-flex align-items-center"
              onClick={() => setShowAdmins(!showAdmins)}
              style={{ fontSize: "0.9rem" }}
            >
              <i className={`bi ${showAdmins ? 'bi-eye-slash' : 'bi-people'} me-1`}></i>
              <span className="d-none d-sm-inline">
                {showAdmins ? 'Ocultar Admins' : 'Ver Admins'}
              </span>
            </button>
            
            {/* Botón para registrar nuevo admin */}
            <button 
              className="btn btn-success me-2 d-flex align-items-center"
              onClick={() => setShowRegister(true)}
              style={{ fontSize: "0.9rem" }}
            >
              <i className="bi bi-person-plus me-1"></i>
              <span className="d-none d-sm-inline">Nuevo Admin</span>
            </button>
            
            {/* Dropdown personalizado */}
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

      {/* Modal de registro */}
      {showRegister && (
        <RegistroUsuario 
          onClose={() => setShowRegister(false)}
          onUserRegistered={(newUser) => {
            console.log('Nuevo administrador registrado:', newUser);
            setShowRegister(false);
            loadAdmins(); // Recargar la lista después de registrar
          }}
        />
      )}

      {/* Lista de administradores */}
      {showAdmins && (
        <div className="container-fluid py-3">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-people me-2"></i>
                    Administradores Registrados
                  </h5>
                  <div>
                    <button 
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={loadAdmins}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-repeat me-1"></i>
                      Actualizar
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowAdmins(false)}
                    >
                      <i className="bi bi-x me-1"></i>
                      Cerrar
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2 text-muted">Cargando administradores...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha de Registro</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center text-muted py-3">
                                No hay administradores registrados
                              </td>
                            </tr>
                          ) : (
                            admins.map(admin => (
                              <tr key={admin.id}>
                                <td className="align-middle">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-person-circle me-2 text-primary"></i>
                                    {admin.name}
                                    {admin.id === user?.id && (
                                      <span className="badge bg-primary ms-2">Tú</span>
                                    )}
                                  </div>
                                </td>
                                <td className="align-middle">{admin.email}</td>
                                <td className="align-middle">
                                  {new Date(admin.created_at).toLocaleDateString('es-MX')}
                                </td>
                                <td className="align-middle">
                                  {admin.id !== user?.id ? (
                                    <button 
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                      title="Eliminar administrador"
                                    >
                                      <i className="bi bi-trash"></i>
                                      <span className="d-none d-md-inline ms-1">Eliminar</span>
                                    </button>
                                  ) : (
                                    <span className="text-muted small">Cuenta actual</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal del dashboard */}
      <main className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <Dashboard />
          </div>
        </div>
      </main>

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