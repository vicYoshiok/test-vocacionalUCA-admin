// src/components/admin/UserDetail.js
import React from 'react';

const UserDetail = ({ result }) => {
  const areas = [
    { code: 'R', name: 'Realista', color: '#E74C3C', percentage: result.porcentaje_R, score: result.puntaje_R },
    { code: 'I', name: 'Investigador', color: '#3498DB', percentage: result.porcentaje_I, score: result.puntaje_I },
    { code: 'A', name: 'Artístico', color: '#9B59B6', percentage: result.porcentaje_A, score: result.puntaje_A },
    { code: 'S', name: 'Social', color: '#2ECC71', percentage: result.porcentaje_S, score: result.puntaje_S },
    { code: 'E', name: 'Emprendedor', color: '#F39C12', percentage: result.porcentaje_E, score: result.puntaje_E },
    { code: 'C', name: 'Convencional', color: '#1ABC9C', percentage: result.porcentaje_C, score: result.puntaje_C },
  ];

  // Ordenar áreas por porcentaje (descendente)
  const sortedAreas = [...areas].sort((a, b) => b.percentage - a.percentage);

  const getTopArea = () => {
    return sortedAreas[0];
  };

  const topArea = getTopArea();

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">
          <i className="bi bi-person-badge me-2"></i>
          Detalles del Usuario
        </h5>
      </div>
      
      <div className="card-body">
        {/* Información personal */}
        <div className="user-info-section mb-4">
          <h6 className="section-title">Información Personal</h6>
          <div className="row">
            <div className="col-12 mb-2">
              <strong>Nombre:</strong> {result.nombre} {result.apellido}
            </div>
            <div className="col-12 mb-2">
              <strong>Correo:</strong> {result.correo}
            </div>
            <div className="col-12 mb-2">
              <strong>Teléfono:</strong> {result.telefono}
            </div>
            <div className="col-12 mb-2">
              <strong>Edad:</strong> {result.edad} años
            </div>
            <div className="col-12">
              <strong>Escuela:</strong> {result.escuela}
            </div>
          </div>
        </div>

        {/* Área principal */}
        <div className="top-area-section mb-4">
          <h6 className="section-title">Área de Mayor Afinidad</h6>
          <div 
            className="top-area-card p-3 rounded text-white"
            style={{ backgroundColor: topArea.color }}
          >
            <div className="d-flex align-items-center">
              <div className="top-area-icon me-3">
                <i className="bi bi-award-fill display-6"></i>
              </div>
              <div>
                <h4 className="mb-1">{topArea.name}</h4>
                <p className="mb-0">{topArea.percentage}% de afinidad</p>
                <small>Puntuación: {topArea.score} puntos</small>
              </div>
            </div>
          </div>
        </div>

        {/* Todas las áreas */}
        <div className="all-areas-section">
          <h6 className="section-title">Puntuaciones por Área</h6>
          <div className="areas-list">
            {sortedAreas.map((area) => (
              <div key={area.code} className="area-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="area-name">
                    <span 
                      className="area-color-indicator me-2"
                      style={{ 
                        backgroundColor: area.color,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                    ></span>
                    {area.name}
                  </span>
                  <span className="area-percentage fw-bold">
                    {area.percentage}%
                  </span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${area.percentage}%`,
                      backgroundColor: area.color
                    }}
                  ></div>
                </div>
                <div className="area-details mt-1">
                  <small className="text-muted">
                    Puntuación: {area.score} puntos
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="additional-info mt-4 pt-3 border-top">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            Test realizado: {new Date(result.created_at).toLocaleString('es-MX')}
          </small>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;