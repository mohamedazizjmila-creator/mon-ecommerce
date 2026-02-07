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
  
  // Méthode principale de connexion (utilise le nouvel endpoint)
  login: async (credentials) => {
    try {
      console.log('🔐 Tentative de connexion frontend:', credentials.username);
      
      // ESSAYER D'ABORD l'endpoint spécifique frontend
      try {
        const response = await api.post('/auth/login', credentials);
        
        if (response.data.success && response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          console.log('✅ Connexion frontend réussie via /login');
        }
        
        return response;
      } catch (frontendError) {
        console.log('🔄 Fallback à l\'endpoint normal /login');
        
        // Fallback à l'endpoint normal
        const response = await api.post('/auth/login', credentials);
        
        if (response.data.success && response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          console.log('✅ Connexion réussie via /login');
        }
        
        return response;
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      throw error;
    }
  },
  
  // ============ SESSION ADMIN ============
  
  // Vérifier si un admin est connecté (optionnel)
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
  
  // Vérifier si l'utilisateur courant est admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
  
  // Debug: Voir l'état de la session
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