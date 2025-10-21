import React, { useState } from 'react';
import { adminAPI } from '../services/auth'; // O importa directamente desde '../services/api'

const RegistroUsuario = ({ onClose, onUserRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Datos del formulario:', formData);

    // Validaciones básicas
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando solicitud de registro...');
      const result = await adminAPI.registerAdmin(formData);
      console.log('Respuesta del servidor:', result);
      
      setSuccess(result.message);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });

      // Notificar al componente padre
      if (onUserRegistered) {
        onUserRegistered(result.user);
      }

      alert("Administrador registrado correctamente");

    } catch (err) {
      console.error('Error capturado en el componente:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              Registrar Nuevo Administrador
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success d-flex align-items-center">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-1"></i>
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-1"></i>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="ejemplo@ucuauhtemoc.edu.mx"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-1"></i>
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Mínimo 8 caracteres"
                  minLength="8"
                />
                <div className="form-text">
                  La contraseña debe tener al menos 8 caracteres
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">
                  <i className="bi bi-lock-fill me-1"></i>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Repita la contraseña"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-1"></i>
                    Registrar Administrador
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroUsuario;





