const API_BASE = 'http://localhost:8000/api';

// Función para manejar las respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

// Función para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

//funcion para obtener los resultados y filtrarlos de diferentes formas
export const adminAPI = {
  // Obtener todos los resultados
  getResults: async () => {
    try {
      const response = await fetch(`${API_BASE}/resultados`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },

  // Obtener resultado específico
  getResult: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/resultados/${id}`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/estadisticas`, {
        headers: getAuthHeaders()
      });
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
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  },

  // Registrar nuevo administrador - CORREGIDO
  registerAdmin: async (userData) => {
    try {
      console.log("Enviando datos para registro:", userData);
      
      const response = await fetch(`${API_BASE}/register-admin`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      console.log("Respuesta del servidor - status:", response.status);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
  },

  // Eliminar administrador
  deleteAdmin: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

   getAdmins: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },
 
  
};