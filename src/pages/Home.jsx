import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { getImageUrl } from '../services/api'; // AJOUTE CET IMPORT

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Charger les produits populaires
  useEffect(() => {
    loadPopularProducts();
    
    // Carousel auto-play
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadPopularProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Récupérer tous les produits
      const response = await productService.getAllProducts();
      
      // Vérifier et traiter la réponse
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data && response.data.produits) {
        products = response.data.produits;
      }
      
      // Prendre les 4 premiers produits (ou moins) comme produits populaires
      const popular = products.slice(0, 4);
      setPopularProducts(popular);
      
    } catch (error) {
      console.error('Erreur chargement produits populaires:', error);
      setError('Impossible de charger les produits');
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

  // Carousel slides simples
  const carouselSlides = [
    {
      id: 1,
      title: 'Bienvenue sur AzizShop',
      subtitle: 'Votre boutique en ligne préférée'
    },
    {
      id: 2,
      title: 'Livraison Rapide',
      subtitle: 'Recevez vos articles en 24-48h'
    },
    {
      id: 3,
      title: 'Meilleurs Prix',
      subtitle: 'Qualité garantie au meilleur prix'
    }
  ];

  // Toutes les catégories avec leurs logos Bootstrap
  const categories = [
    // Catégories principales
    { id: 1, name: 'Informatique', icon: 'bi-pc-display' },
    { id: 2, name: 'Électronique', icon: 'bi-laptop' },
    { id: 3, name: 'Maison', icon: 'bi-house-door' },
    { id: 4, name: 'Sports', icon: 'bi-bicycle' },
    { id: 5, name: 'Beauté', icon: 'bi-droplet' },
    { id: 6, name: 'Loisirs', icon: 'bi-controller' },
  ];

  // Fonction pour formater le nom de catégorie pour l'URL
  const formatCategoryForUrl = (categoryName) => {
    return categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="home-page">
      {/* Hero Section avec Carousel */}
      <section className="hero-section bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Bienvenue sur <span className="text-warning">AzizShop</span>
              </h1>
              
              <div className="carousel-indicators mb-4">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    className={index === currentSlide ? 'active' : ''}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      margin: '0 5px',
                      backgroundColor: index === currentSlide ? '#ffc107' : 'rgba(255,255,255,0.5)'
                    }}
                  />
                ))}
              </div>
              
              <div className="mb-4">
                <h3 className="h2">{carouselSlides[currentSlide].title}</h3>
                <p className="lead">{carouselSlides[currentSlide].subtitle}</p>
              </div>
              
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-warning btn-lg" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => navigate('/produits')}
                >
                  Voir tous les produits
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate('/panier')}
                >
                  <i className="bi bi-cart me-1"></i>
                  Mon panier
                </button>
              </div>
            </div>
            
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="bg-warning bg-opacity-10 p-4 rounded">
                <i className="bi bi-bag display-1 text-warning mb-3"></i>
                <h3>Votre shopping en ligne</h3>
                <p className="mb-0">
                  Découvrez notre sélection de produits de qualité
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories complètes */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              className="btn btn-outline-warning"
              onClick={() => navigate('/produits')}
            >
              Voir tous les produits
            </button>
          </div>
          
          {/* Groupe de catégories par sections */}
          <div className="mt-5">
            <h4 className="mb-4">Catégories populaires</h4>
            <div className="row g-3">
              {categories.slice(0, 6).map((category) => (
                <div className="col-md-2 col-4" key={category.id}>
                  <div 
                    className="card text-center border-0 shadow p-3"
                    onClick={() => navigate(`/produits?category=${formatCategoryForUrl(category.name)}`)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: '#fff9e6',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ffc107';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className={`bi ${category.icon} text-warning fs-3 mb-2`}></i>
                    <h6 className="mb-0">{category.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Produits populaires */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Produits populaires</h2>
            <button 
              className="btn btn-outline-warning"
              onClick={() => navigate('/produits')}
            >
              Voir plus
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          ) : popularProducts.length > 0 ? (
            <div className="row g-4">
              {popularProducts.map((product) => (
                <div className="col-md-3 col-6" key={product.id}>
                  <div className="card h-100 shadow-sm product-card">
                    {/* Image du produit */}
                    <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        {product.imageUrl ? (
                          <img 
                            src={getImageUrl(product.imageUrl)} // MODIFIÉ ICI
                            alt={product.nom}
                            className="img-fluid h-100 w-100"
                            style={{ 
                              objectFit: 'contain',
                              padding: '10px'
                            }}
                          onError={(e) => {
  e.target.onerror = null;
  e.target.style.display = 'none';
}}
                          />
                        ) : (
                          <div className="text-center p-3">
                            <i className="bi bi-image text-warning fs-1"></i>
                          </div>
                        )}
                      </div>
                      
                      {/* Badge stock */}
                      {product.quantite > 0 && (
                        <span className="position-absolute top-0 start-0 m-2 badge bg-success">
                          En stock
                        </span>
                      )}
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title" title={product.nom}>
                        {product.nom}
                      </h5>
                      
                      <p className="card-text text-muted small flex-grow-1">
                        {product.description ? 
                          (product.description.length > 50 ? 
                            `${product.description.substring(0, 50)}...` : 
                            product.description) 
                          : 'Pas de description'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold text-warning fs-5">
                          {product.prix ? `${product.prix} €` : 'Prix non disponible'}
                        </span>
                        
                        <span className={`badge ${product.quantite > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.quantite > 0 ? `${product.quantite} en stock` : 'Rupture'}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <Link 
                          to={`/produits/${product.id}`}
                          className="btn btn-warning w-100 btn-sm"
                        >
                          <i className="bi bi-eye me-1"></i>
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
              <h4>Aucun produit disponible</h4>
              <p className="text-muted">Les produits seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Pourquoi nous choisir ?</h2>
          
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-3">
                <i className="bi bi-truck text-warning fs-1 mb-3"></i>
                <h5>Livraison Rapide</h5>
                <p className="text-muted">Expédition sous 24-48h</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="p-3">
                <i className="bi bi-shield-check text-warning fs-1 mb-3"></i>
                <h5>Paiement Sécurisé</h5>
                <p className="text-muted">Transactions 100% sécurisées</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="p-3">
                <i className="bi bi-headset text-warning fs-1 mb-3"></i>
                <h5>Support Client</h5>
                <p className="text-muted">Assistance 7j/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-warning">
        <div className="container text-center">
          <h2 className="mb-4">Prêt à commencer ?</h2>
          <p className="lead mb-4">
            Découvrez notre large sélection de produits
          </p>
          <button 
            className="btn btn-dark btn-lg"
            onClick={() => navigate('/produits')}
          >
            <i className="bi bi-bag me-2"></i>
            Commencer le shopping
          </button>
        </div>
      </section>

      {/* Styles */}
      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
          background-color: #fff9e6;
          border: 1px solid #ffc107 !important;
        }
        
        .category-card {
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .card-img-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
      `}</style>
    </div>
  );
};

export default Home;