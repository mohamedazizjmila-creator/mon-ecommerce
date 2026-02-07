// services/authService.js
import api from './api';

export const authService = {
  // ============ INSCRIPTION ============
  register: async (userData) => {
    try {
      console.log('📝 Tentative d\'inscription:', userData.username);
      
      const response = await api.post('/auth/public/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'USER'
      });
      
      console.log('✅ Inscription réussie:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },
  
  // ============ CONNEXION ============
  login: async (credentials) => {
    try {
      console.log('🔐 Tentative de connexion:', credentials.username);
      
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        console.log('✅ Connexion réussie');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  },
  
  // ============ UTILITAIRES ============
  logout: async () => {
    try {
      localStorage.removeItem('currentUser');
      const response = await api.post('/auth/logout');
      console.log('👋 Déconnexion réussie');
      return response;
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      throw error;
    }
  },
  
  checkSession: () => api.get('/auth/check-session'),
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('currentUser') !== null;
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
  
  checkUsername: async (username) => {
    try {
      const response = await api.get(`/auth/check-username/${username}`);
      return response.data.exists;
    } catch (error) {
      console.error('❌ Erreur vérification username:', error);
      throw error;
    }
  }
};