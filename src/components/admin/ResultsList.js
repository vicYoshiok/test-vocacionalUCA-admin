// src/components/admin/ResultsList.js
import React, { useState } from 'react';

const ResultsList = ({ results, onSelectResult, selectedResult, onDeleteResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filtrar resultados
  const filteredResults = results.filter(result =>
    result.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.escuela?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar resultados
  const sortedResults = [...filteredResults].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'nombre':
        aValue = `${a.nombre} ${a.apellido}`;
        bValue = `${b.nombre} ${b.apellido}`;
        break;
      case 'escuela':
        aValue = a.escuela;
        bValue = b.escuela;
        break;
      case 'edad':
        aValue = a.edad;
        bValue = b.edad;
        break;
      case 'fecha':
      default:
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getAreaColorClass = (areaCode) => {
    const colors = {
      'R': 'border-start-primary',
      'I': 'border-start-info',
      'A': 'border-start-warning',
      'S': 'border-start-success',
      'E': 'border-start-danger',
      'C': 'border-start-secondary'
    };
    return colors[areaCode] || 'border-start-primary';
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Función para formatear las respuestas para mostrar - CORREGIDA
  const formatResponses = (responses) => {
    if (!responses) return [];
    
    console.log('Raw responses:', responses);
    
    let parsedResponses = responses;
    
    // Si las respuestas son un string JSON, las parseamos
    if (typeof responses === 'string') {
      try {
        parsedResponses = JSON.parse(responses);
      } catch (error) {
        console.error('Error parsing responses:', error);
        return [];
      }
    }
    
    // Si es un objeto, lo convertimos en array
    if (typeof parsedResponses === 'object' && parsedResponses !== null && !Array.isArray(parsedResponses)) {
      return Object.entries(parsedResponses).map(([key, value]) => ({
        pregunta: key,
        respuesta: value
      }));
    }
    
    // Si ya es un array, lo retornamos directamente
    if (Array.isArray(parsedResponses)) {
      return parsedResponses;
    }
    
    // Si no es ninguno de los formatos esperados, retornamos array vacío
    return [];
  };

  const handleShowResponses = (result, e) => {
    e.stopPropagation();
    console.log('Result object:', result);
    console.log('Responses field:', result.respuestas || result.responses || result.answers);
    
    const responses = result.respuestas || result.responses || result.answers;
    setSelectedResponses(responses);
    setSelectedStudent(result);
    setShowResponsesModal(true);
  };

  const closeResponsesModal = () => {
    setShowResponsesModal(false);
    setSelectedResponses(null);
    setSelectedStudent(null);
  };

  // Función para renderizar las respuestas en el modal
  const renderResponses = () => {
    if (!selectedResponses) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-exclamation-circle display-4 text-muted"></i>
          <p className="mt-3 text-muted">No hay información de respuestas disponible</p>
        </div>
      );
    }

    const formattedResponses = formatResponses(selectedResponses);
    console.log('Formatted responses:', formattedResponses);

    if (!Array.isArray(formattedResponses) || formattedResponses.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-exclamation-circle display-4 text-muted"></i>
          <p className="mt-3 text-muted">
            No se pudieron cargar las respuestas<br />
            <small>Formato de datos no compatible</small>
          </p>
          <div className="mt-3 p-3 bg-light rounded">
            <small>
              <strong>Datos crudos:</strong><br />
              {JSON.stringify(selectedResponses)}
            </small>
          </div>
        </div>
      );
    }

    return formattedResponses.map((response, index) => {
      // Manejar diferentes estructuras de respuesta
      const pregunta = response.pregunta || response.question || `Pregunta ${index + 1}`;
      const respuesta = response.respuesta || response.answer || response.response || response;
      const area = response.area || response.category;
      const puntuacion = response.puntuacion || response.score || response.points;

      return (
        <div key={index} className="response-item card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h6 className="card-title text-primary">
                  {pregunta}
                </h6>
                <p className="mb-2">
                  <strong>Respuesta:</strong> {respuesta}
                </p>
                <div className="mt-2">
                  {area && (
                    <span className="badge bg-secondary me-2">
                      Área: {area}
                    </span>
                  )}
                  {puntuacion !== undefined && (
                    <span className="badge bg-info">
                      Puntuación: {puntuacion}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-muted ms-3">
                <small>#{index + 1}</small>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <style jsx>{`
        .result-card {
          transition: all 0.2s ease-in-out;
          border: 2px solid transparent;
        }
        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
          border-color: #dee2e6;
        }
        .result-card.selected {
          border-color: #0d6efd;
          background-color: #f8f9fa;
        }
        .result-card.selected .card-body {
          background-color: #f8f9fa;
        }
      `}</style>
      
      <div className="card results-list-card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-list-check me-2"></i>
            Resultados ({sortedResults.length})
          </h5>
        </div>
        
        <div className="card-body p-0">
          {/* Controles de búsqueda y ordenamiento */}
          <div className="p-3 border-bottom bg-light">
            <div className="row g-2">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, correo o escuela..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="input-group">
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="fecha">Ordenar por fecha</option>
                    <option value="nombre">Ordenar por nombre</option>
                    <option value="escuela">Ordenar por escuela</option>
                    <option value="edad">Ordenar por edad</option>
                  </select>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de resultados */}
          <div className="results-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {sortedResults.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox display-4 d-block mb-3"></i>
                <p className="mb-0">No se encontraron resultados</p>
                <small>Intenta con otros términos de búsqueda</small>
              </div>
            ) : (
              <div className="p-2">
                {sortedResults.map((result, index) => {
                  const isSelected = selectedResult?.id === result.id;
                  // Usamos el área con mayor porcentaje para el color del borde
                  const areas = [
                    { code: 'R', percentage: result.porcentaje_R },
                    { code: 'I', percentage: result.porcentaje_I },
                    { code: 'A', percentage: result.porcentaje_A },
                    { code: 'S', percentage: result.porcentaje_S },
                    { code: 'E', percentage: result.porcentaje_E },
                    { code: 'C', percentage: result.porcentaje_C },
                  ];
                  const topArea = areas.reduce((prev, current) => 
                    (prev.percentage > current.percentage) ? prev : current
                  );
                  const borderClass = getAreaColorClass(topArea.code);
                  
                  return (
                    <div
                      key={result.id}
                      className={`result-card card mb-2 ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectResult(result)}
                    >
                      <div className={`card-body ${borderClass} border-start-4`}>
                        <div className="row align-items-center">
                          {/* Información principal */}
                          <div className="col-md-5">
                            <div className="d-flex align-items-center">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${isSelected ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                                {result.nombre?.charAt(0)}{result.apellido?.charAt(0)}
                              </div>
                              <div>
                                <h6 className="mb-1 text-dark">
                                  {result.nombre} {result.apellido}
                                </h6>
                                <small className="text-muted">
                                  <i className="bi bi-envelope me-1"></i>
                                  {result.correo}
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* Información secundaria */}
                          <div className="col-md-4">
                            <div className="text-muted">
                              <small>
                                <i className="bi bi-building me-1"></i>
                                {result.escuela}
                              </small>
                            </div>
                            <div className="text-muted">
                              <small>
                                <i className="bi bi-person me-1"></i>
                                Edad: {result.edad}
                              </small>
                            </div>
                          </div>

                          {/* Acciones y fecha */}
                          <div className="col-md-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted">
                                  {new Date(result.created_at).toLocaleDateString('es-MX')}
                                </small>
                              </div>
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-info me-1"
                                  onClick={(e) => handleShowResponses(result, e)}
                                  title="Ver respuestas del test"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteResult(result.id);
                                  }}
                                  title="Eliminar resultado"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar las respuestas del test */}
      {showResponsesModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-list-check me-2"></i>
                  Detalle de Respuestas del Test
                  {selectedStudent && (
                    <small className="d-block mt-1">
                      {selectedStudent.nombre} {selectedStudent.apellido} - {selectedStudent.escuela}
                    </small>
                  )}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeResponsesModal}
                ></button>
              </div>
              <div className="modal-body">
                {renderResponses()}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeResponsesModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsList;