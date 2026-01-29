import api from './api';

export const productService = {
  getAllProducts: () => api.get('/produits'),
  getProductById: (id) => api.get(`/produits/${id}`),
  searchProducts: (keyword) => api.get(`/produits/search?keyword=${keyword}`),
  getProductsByCategory: (categoryId) => api.get(`/produits/categorie/${categoryId}`),
  getProductsInStock: () => api.get('/produits/in-stock'),
  getProductsCount: () => api.get('/produits/count')
};