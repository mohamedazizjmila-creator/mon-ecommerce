import api from './api';

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      
      // Si la réponse est un objet unique (une seule catégorie)
      // On le transforme en tableau
      if (response.data && !Array.isArray(response.data)) {
        // Retourner un tableau contenant la catégorie unique
        return { data: [response.data] };
      }
      
      return response;
    } catch (error) {
      console.error('Erreur dans categoryService:', error);
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur récupération catégorie:', error);
      throw error;
    }
  },

  // Autres méthodes si besoin...
};