import axios from 'axios';

// URL dynamique selon l'environnement
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Instance PRINCIPALE (avec cookies)
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT pour les cookies de session
});

// Instance SANS COOKIES pour l'inscription publique
export const apiNoCookies = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // PAS de cookies pour l'inscription
});

// Intercepteur pour les réponses (seulement pour l'instance principale)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Non authentifié
      localStorage.removeItem('currentUser');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// Fonction de test de connexion
export const testConnection = async () => {
  try {
    const response = await api.get('/produits');
    console.log('✅ Connexion API réussie !');
    console.log('URL utilisée:', API_BASE_URL);
    console.log('Nombre de produits:', response.data.length);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion API:');
    console.error('URL tentée:', API_BASE_URL);
    console.error('Message:', error.message);
    console.log('Vérifiez que:');
    console.log('1. L\'API est accessible à:', API_BASE_URL);
    console.log('2. CORS est configuré sur le backend');
    return false;
  }
};
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  
  // Si le chemin commence déjà par /uploads, ne pas le dupliquer
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  
  return `${API_URL}/uploads/${imagePath}`;
};

export default api;