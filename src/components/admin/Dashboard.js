// src/components/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import ResultsList from './ResultsList';
import Statistics from './Statistics';
import PDFGenerator from './PDFGenerator';
import UserDetail from './UserDetail';
import './Dashboard.css';

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    loadData();
  }, [refresh]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [resultsData, statsData] = await Promise.all([
        adminAPI.getResults(),
        adminAPI.getStats()
      ]);
      
      setResults(resultsData.data || []);
      setStats(statsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este resultado?')) {
      try {
        await adminAPI.deleteResult(id);
        setResults(prev => prev.filter(result => result.id !== id));
        if (selectedResult?.id === id) {
          setSelectedResult(null);
        }
        alert('Resultado eliminado correctamente');
      } catch (error) {
        alert('Error al eliminar el resultado: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando datos del panel administrativo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title">Panel Administrativo - Test Vocacional</h1>
            <p className="dashboard-subtitle">Gestión de resultados y estadísticas</p>
          </div>
          <button className="btn btn-outline-primary" onClick={handleRefresh}>
            <i className="bi bi-arrow-clockwise"></i> Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && <Statistics stats={stats} />}

      <div className="dashboard-content">
        <div className="row">
          {/* Lista de resultados */}
          <div className="col-lg-8 mb-4">
            <ResultsList 
              results={results} 
              onSelectResult={setSelectedResult}
              selectedResult={selectedResult}
              onDeleteResult={handleDeleteResult}
            />
          </div>
          
          {/* Panel lateral */}
          <div className="col-lg-4">
            {selectedResult ? (
              <>
                <UserDetail result={selectedResult} />
                <PDFGenerator result={selectedResult} />
              </>
            ) : (
              <div className="card">
                <div className="card-body text-center text-muted">
                  <i className="bi bi-person-lines-fill display-4"></i>
                  <p className="mt-3">Selecciona un resultado para ver los detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;