import api from './api';
import { authService } from './authService';

export const favoriService = {
  // Récupérer les favoris de l'utilisateur connecté
  getMesFavoris: async () => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Utilisateur non connecté');
    }
    return api.get(`/favoris/mes-favoris?userId=${user.id}`);
  },
  
  // Ajouter un produit aux favoris
  ajouterFavori: async (produitId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Utilisateur non connecté');
    }
    return api.post(`/favoris/ajouter?userId=${user.id}&produitId=${produitId}`, {});
  },
  
  // Retirer un produit des favoris
  retirerFavori: async (produitId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Utilisateur non connecté');
    }
    return api.delete(`/favoris/retirer?userId=${user.id}&produitId=${produitId}`);
  },
  
  // Vérifier si un produit est dans les favoris
  verifierFavori: async (produitId) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) {
      // Si pas connecté, retourner faux
      return { data: { isFavori: false } };
    }
    return api.get(`/favoris/verifier?userId=${user.id}&produitId=${produitId}`);
  }
};