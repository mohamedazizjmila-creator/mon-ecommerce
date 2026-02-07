// services/authService.js - Version SIMPLE (sans OTP, sans Google)
import api from './api';

export const authService = {
  // ============ INSCRIPTION ============
  
  // Inscription USER classique
  register: async (userData) => {
    try {
      console.log('📝 Inscription classique:', userData.username);
      
      const response = await api.post('/auth/public/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'USER'
      });
      
      console.log('✅ Inscription réussie');
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },
  
  // ============ CONNEXION ============
  
  login: async (credentials) => {
    try {
      console.log('🔐 Connexion classique:', credentials.username);
      
      const response = await api.post('/auth/login', credentials);
      
      // Vérifier si c'est un compte ADMIN (bloquer)
      if (response.data.redirectToBackend) {
        throw new Error('Les comptes admin doivent se connecter via le panel admin');
      }
      
      if (response.data.success && response.data.user) {
        // Vérifier le rôle
        if (response.data.user.role === 'ADMIN') {
          throw new Error('Accès admin non autorisé depuis cette interface');
        }
        
        // Stocker l'utilisateur
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        console.log('✅ Connexion réussie - Rôle:', response.data.user.role);
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
      await api.post('/auth/logout');
      localStorage.removeItem('currentUser');
      console.log('👋 Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      // Déconnecter quand même côté client
      localStorage.removeItem('currentUser');
      throw error;
    }
  },
  
  checkSession: async () => {
    try {
      const response = await api.get('/auth/check-session');
      return response;
    } catch (error) {
      console.error('❌ Erreur vérification session:', error);
      throw error;
    }
  },
  
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
  
  isAuthenticated: () => {
    return localStorage.getItem('currentUser') !== null;
  },
  
  isUser: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'USER';
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
  
  // ============ VÉRIFICATION USERNAME ============
  
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