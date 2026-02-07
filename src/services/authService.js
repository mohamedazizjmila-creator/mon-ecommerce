// services/authService.js - Pour FRONTEND (USER seulement)
import api from './api';

export const authService = {
  // ============ INSCRIPTION (toujours USER) ============
  register: async (userData) => {
    try {
      console.log('📝 Inscription USER:', userData.username);
      
      const response = await api.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password
        // Le rôle "USER" est forcé côté serveur
      });
      
      console.log('✅ Inscription USER réussie:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },
  
  // ============ CONNEXION (USER seulement) ============
  login: async (credentials) => {
    try {
      console.log('🔐 Connexion USER:', credentials.username);
      
      const response = await api.post('/auth/login', credentials);
      
      // Vérifier si c'est un ADMIN qui tente de se connecter
      if (response.data.redirectToBackend) {
        throw new Error('Les comptes admin doivent se connecter via le panel admin');
      }
      
      if (response.data.success && response.data.user) {
        // Vérifier que c'est bien un USER
        if (response.data.user.role !== 'USER') {
          throw new Error('Accès non autorisé - Compte admin détecté');
        }
        
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('loginSource', 'frontend');
        console.log('✅ Connexion USER réussie');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  },
  
  // ============ DÉCONNEXION ============
  logout: async () => {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loginSource');
      const response = await api.post('/auth/logout');
      console.log('👋 Déconnexion réussie');
      return response;
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      throw error;
    }
  },
  
  // ============ VÉRIFICATION SESSION ============
  checkSession: async () => {
    try {
      const response = await api.get('/auth/check-session');
      
      // Si session invalide (ex: admin sur frontend), déconnecter
      if (!response.data.authenticated && response.data.message) {
        console.log('⚠️  Session invalide:', response.data.message);
        await authService.logout();
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur vérification session:', error);
      return { data: { authenticated: false } };
    }
  },
  
  // ============ UTILITAIRES ============
  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Vérifier que c'est bien un USER
        if (user.role !== 'USER') {
          authService.logout();
          return null;
        }
        return user;
      } catch (e) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginSource');
        return null;
      }
    }
    return null;
  },
  
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    const loginSource = localStorage.getItem('loginSource');
    return user !== null && loginSource === 'frontend';
  },
  
  isUser: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'USER';
  },
  
  isAdmin: () => {
    // Toujours false pour le frontend
    return false;
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