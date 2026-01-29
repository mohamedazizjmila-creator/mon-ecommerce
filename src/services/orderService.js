// src/services/orderService.js
import api from './api';
import { authService } from './authService';

export const orderService = {
  // Créer une commande
  creerCommande: async (shippingAddress, paymentMethod) => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Vous devez être connecté pour commander');
    
    console.log('📦 POST /orders/creer', { 
      userId: user.id, 
      shippingAddress, 
      paymentMethod 
    });
    
    return api.post('/orders/creer', null, {
      params: {
        userId: user.id,
        shippingAddress,
        paymentMethod
      }
    });
  },

  // Récupérer les commandes de l'utilisateur
  getMesCommandes: async () => {
    const user = authService.getCurrentUser();
    if (!user || !user.id) throw new Error('Utilisateur non connecté');
    
    console.log(`📦 GET /orders/mes-commandes?userId=${user.id}`);
    return api.get('/orders/mes-commandes', {
      params: { userId: user.id }
    });
  },

  // Récupérer une commande spécifique
  getCommande: async (orderId) => {
    console.log(`📦 GET /orders/${orderId}`);
    return api.get(`/orders/${orderId}`);
  },

  // Annuler une commande
  annulerCommande: async (orderId) => {
    console.log(`❌ PUT /orders/${orderId}/annuler`);
    return api.put(`/orders/${orderId}/annuler`);
  },

  // Récupérer les items d'une commande
  getOrderItems: async (orderId) => {
    console.log(`📋 GET /order-items/commande/${orderId}`);
    return api.get(`/order-items/commande/${orderId}`);
  }
};