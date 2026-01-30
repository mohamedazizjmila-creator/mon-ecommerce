import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { getImageUrl } from '../services/api'; // AJOUTE CET IMPORT

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProductsFromURL();
  }, [location.search]);

  const loadProductsFromURL = () => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    
    if (search) {
      setSearchTerm(search);
      searchProducts(search);
    } else if (category) {
      const cat = categories.find(c => c.nom === category);
      if (cat) {
        loadProductsByCategory(cat.id);
      } else {
        loadAllProducts();
      }
    } else {
      loadAllProducts();
    }
  };

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getAllProducts();
      
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.produits) {
        setProducts(response.data.produits);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      console.log('Réponse catégories:', response.data);
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data) {
        setCategories([response.data]);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    }
  };

  const searchProducts = async (keyword) => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.searchProducts(keyword);
      
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.produits) {
        setProducts(response.data.produits);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getProductsByCategory(categoryId);
      
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.produits) {
        setProducts(response.data.produits);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur filtre catégorie:', error);
      setError('Erreur lors du filtrage par catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const categoriesArray = Array.isArray(categories) ? categories : [];

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-3">
            <i className="bi bi-shop-window text-warning me-2"></i>
            Produits AzizShop
          </h1>
          <p className="text-muted">
            Découvrez notre sélection de produits
          </p>
        </div>
        <div className="col-md-4">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-warning" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-warning"
              onClick={() => {
                navigate('/produits');
                setSearchTerm('');
              }}
            >
              Tous
            </button>
            
            {categoriesArray.length > 0 ? (
              categoriesArray.map((cat) => (
                <button
                  key={cat.id}
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => navigate(`/produits?category=${encodeURIComponent(cat.nom)}`)}
                >
                  {cat.nom}
                </button>
              ))
            ) : (
              <span className="text-muted">Aucune catégorie disponible</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des produits...</p>
        </div>
      ) : (
        <>
          {products && products.length > 0 ? (
            <div className="row">
              {products.map((product) => (
                <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
                  <div className="card h-100 product-card shadow-sm">
                    <div className="card-img-top bg-light text-center p-4" style={{ height: '200px' }}>
                      {product.imageUrl ? (
                        <img 
                          src={getImageUrl(product.imageUrl)} // MODIFIÉ ICI
                          alt={product.nom}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
onError={(e) => {
  e.target.onerror = null;
  e.target.style.display = 'none';
}}
                        />
                      ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                          <i className="bi bi-box display-4 text-muted"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.nom}</h5>
                      <p className="card-text text-muted small flex-grow-1">
                        {product.description ? 
                          (product.description.length > 100 ? 
                            `${product.description.substring(0, 100)}...` : 
                            product.description) 
                          : 'Pas de description'}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h4 text-warning mb-0">{product.prix} €</span>
                          <span className={`badge ${product.quantite > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {product.quantite > 0 ? 'En stock' : 'Rupture'}
                          </span>
                        </div>
                        
                        <Link to={`/produits/${product.id}`} className="btn btn-warning w-100 mt-3">
                          <i className="bi bi-eye me-2"></i>
                          Voir détails
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
              <h3>Aucun produit disponible</h3>
              <p className="text-muted">Aucun produit ne correspond à votre recherche.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;