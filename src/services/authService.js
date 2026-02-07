import api, { apiNoCookies } from './api';

export const authService = {
  // ============ INSCRIPTION ============
  
  // INSCRIPTION PUBLIQUE (utilise l'endpoint public)
  registerPublic: async (userData) => {
    try {
      console.log('📝 Tentative d\'inscription publique:', userData.username);
      
      const response = await apiNoCookies.post('/auth/public/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password
        // Le rôle USER est défini automatiquement par le backend
      });
      
      console.log('✅ Inscription publique réussie:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur inscription publique:', error);
      throw error;
    }
  },
  
  // Inscription normale
  register: (userData) => api.post('/auth/register', userData),
  
  // ============ CONNEXION ============
  
  // Méthode principale de connexion SIMPLIFIÉE
  login: async (credentials) => {
    try {
      console.log('🔐 Tentative de connexion:', credentials.username);
      
      // Utiliser directement l'endpoint principal
      const response = await api.post('/auth/login', credentials);
      
      console.log('📋 Réponse login:', response.data);
      
      if (response.data.success && response.data.user) {
        // Stocker les informations utilisateur dans localStorage
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          sessionId: response.data.sessionId
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Utilisateur stocké dans localStorage');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  },
  
  // ============ SESSION ADMIN ============
  
  // Vérifier si un admin est connecté (simplifié)
  checkAdminSession: async () => {
    try {
      const response = await api.get('/auth/check-admin-session');
      console.log('🔍 Session admin:', response.data);
      return response;
    } catch (error) {
      console.log('ℹ️ Pas de session admin détectée');
      return { data: { adminConnected: false } };
    }
  },
  
  // ============ UTILITAIRES ============
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('currentUser');
      console.log('👋 Déconnexion réussie');
      return response;
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      localStorage.removeItem('currentUser');
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
  
  // DEBUG
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
}