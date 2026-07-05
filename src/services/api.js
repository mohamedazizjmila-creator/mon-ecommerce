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
  // 1. Si PAS d'image dans la base
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return null;
  }
  
  const BACKEND_URL = 'https://projet-api-v2.onrender.com';
  
  // 2. Si c'est déjà une URL complète, la garder telle quelle
  // (backend, LoremFlickr, ou tout autre CDN d'images produits)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 3. Si c'est un chemin relatif (/uploads/...)
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('/images/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // 4. Si c'est juste un nom de fichier
  if (imagePath.includes('.jpg') || imagePath.includes('.jpeg') || imagePath.includes('.png')) {
    return `${BACKEND_URL}/uploads/${imagePath}`;
  }
  
  // 5. Par défaut → null
  return null;
};
export default api;