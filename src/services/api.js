// En src/services/api.js

export const API_URL = 'https://proyecto-final-backend-3gw2.onrender.com';

/**
 * Concatena la URL base de la API con un endpoint específico.
 * @param {string} endpoint - Ejemplo: '/products?query=...'
 * @returns {string} La URL completa.
 */
export const getApiUrl = (endpoint) => {
    return `${API_URL}${endpoint}`;
};