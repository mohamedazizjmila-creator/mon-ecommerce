// services/panierService.js - VERSION CORRIGÉE
import api from './api';
import { authService } from './authService';

export const panierService = {
  getMonPanier: async () => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`🛒 GET /panier/mon-panier?userId=${user.id}`);
    return api.get(`/panier/mon-panier?userId=${user.id}`); // Enlever /api
  },
  
  ajouterAuPanier: async (produitId, quantite = 1) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`➕ POST /panier/ajouter?userId=${user.id}&produitId=${produitId}&quantite=${quantite}`);
    
    // CORRECTION : Utilisez '/panier/ajouter' au lieu de '/api/panier/ajouter'
    return api.post(`/panier/ajouter?userId=${user.id}&produitId=${produitId}&quantite=${quantite}`, {});
  },
  
  updateQuantite: async (produitId, quantite) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`📊 PUT /panier/update?userId=${user.id}&produitId=${produitId}&quantite=${quantite}`);
    
    return api.put(`/panier/update?userId=${user.id}&produitId=${produitId}&quantite=${quantite}`, {});
  },
  
  retirerDuPanier: async (produitId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`🗑️ DELETE /panier/retirer?userId=${user.id}&produitId=${produitId}`);
    
    return api.delete(`/panier/retirer?userId=${user.id}&produitId=${produitId}`);
  },
  
  viderPanier: async () => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`🧹 DELETE /panier/vider?userId=${user.id}`);
    
    return api.delete(`/panier/vider?userId=${user.id}`);
  }
};