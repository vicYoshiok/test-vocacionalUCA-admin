// src/services/api.js
const API_BASE = 'http://localhost:8000/api';

// Función para manejar las respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

export const adminAPI = {
  // Obtener todos los resultados
  getResults: async () => {
    try {
      const response = await fetch(`${API_BASE}/resultados`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },

  // Obtener resultado específico
  getResult: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/resultados/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/estadisticas`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Eliminar resultado
  deleteResult: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/resultados/${id}`, {
        method: 'DELETE'
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  }
};