// services/authService.js
import api, { apiNoCookies } from './api';

export const authService = {
  // ============ INSCRIPTION ============
  
  // 1. INSCRIPTION PUBLIQUE (pour les clients frontend - sans cookies)
  registerPublic: async (userData) => {
    try {
      console.log('📝 Tentative d\'inscription publique:', userData.username);
      
      const response = await apiNoCookies.post('/auth/public/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'USER' // Toujours USER pour les clients
      });
      
      console.log('✅ Inscription publique réussie:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription publique:', error);
      throw error;
    }
  },
  
  // 2. Inscription normale (gardée pour compatibilité)
  register: (userData) => api.post('/auth/register', userData),
  
  // ============ CONNEXION ============
  
  // Méthode principale de connexion
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
  
  // ============ GOOGLE SIGN-IN ============
  
  googleLogin: async (googleData) => {
    try {
      console.log('🔐 Tentative de connexion Google...');
      
      const response = await api.post('/auth/google-login', googleData);
      
      if (response.data.success && response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        console.log('✅ Google login réussi');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur Google login:', error);
      throw error;
    }
  },
  
  // ============ VÉRIFICATION EMAIL ============
  
  sendVerificationEmail: async (email) => {
    try {
      console.log('📧 Envoi de code de vérification à:', email);
      
      const response = await api.post('/auth/send-verification-email', { email });
      
      console.log('✅ Code envoyé:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur envoi code:', error);
      throw error;
    }
  },
  
  verifyEmail: async (verificationData) => {
    try {
      console.log('🔐 Vérification email pour:', verificationData.email);
      
      const response = await api.post('/auth/verify-email', verificationData);
      
      console.log('✅ Vérification réussie:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur vérification:', error);
      throw error;
    }
  },
  
  // ============ SESSION ADMIN ============
  
  checkAdminSession: async () => {
    try {
      const response = await api.get('/auth/check-admin-session');
      if (response.data.adminConnected) {
        console.log('👑 Admin connecté détecté:', response.data.adminUsername);
      }
      return response;
    } catch (error) {
      console.log('ℹ️ Pas de session admin détectée');
      return { data: { adminConnected: false } };
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
  
  debugSession: async () => {
    try {
      const response = await api.get('/auth/debug/session');
      console.log('🔍 Debug session:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur debug session:', error);
      return null;
    }
  }
};