import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { panierService } from '../services/panierService';
import { favoriService } from '../services/favoriService';
import { authService } from '../services/authService';
import { getImageUrl } from '../services/api'; // AJOUTE CET IMPORT

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFavori, setTogglingFavori] = useState(false);
  const [isFavori, setIsFavori] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 ProductDetail monté avec ID:', id);
    loadProduct();
    checkIfFavori();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Chargement produit ID: ${id}`);
      
      const response = await productService.getProductById(id);
      console.log('✅ Produit chargé:', response.data);
      setProduct(response.data);
    } catch (error) {
      console.error('❌ Erreur chargement produit:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      if (error.response?.status === 404) {
        setError('Produit non trouvé');
      } else {
        setError('Erreur lors du chargement du produit');
      }
      
      await tryAlternativeMethod();
    } finally {
      setLoading(false);
    }
  };

  const tryAlternativeMethod = async () => {
    try {
      console.log('🔄 Tentative méthode alternative...');
      const response = await productService.getAllProducts();
      const allProducts = response.data || [];
      console.log(`📊 ${allProducts.length} produits disponibles`);
      
      const productIdNum = Number(id);
      const foundProduct = allProducts.find(p => p.id === productIdNum);
      
      if (foundProduct) {
        console.log('✅ Produit trouvé via méthode alternative');
        setProduct(foundProduct);
        setError(null);
      } else {
        console.error(`❌ Produit ID ${id} non trouvé dans la liste`);
      }
    } catch (error) {
      console.error('❌ Méthode alternative échouée:', error);
    }
  };

  const checkIfFavori = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      console.log('👤 Utilisateur non connecté, pas de vérification favori');
      return;
    }
    
    console.log(`🔍 Vérification favori pour produit ${id}, utilisateur ${user.id}`);
    
    try {
      const response = await favoriService.verifierFavori(id);
      setIsFavori(response.data.isFavori || false);
      console.log(`❤️ État favori: ${response.data.isFavori ? 'favori' : 'non favori'}`);
    } catch (error) {
      console.error('❌ Erreur vérification favori:', error);
      setIsFavori(false);
    }
  };

  const handleAddToCart = async () => {
    console.log('🟢 handleAddToCart EXÉCUTÉ !');
    
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Veuillez vous connecter pour ajouter au panier');
      navigate('/connexion');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await panierService.ajouterAuPanier(id, quantite);
      console.log('✅ Réponse reçue:', response.data);
      alert(`${product.nom} ajouté au panier !`);
    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavori = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Veuillez vous connecter pour gérer vos favoris');
      navigate('/connexion');
      return;
    }

    setTogglingFavori(true);
    
    try {
      if (isFavori) {
        await favoriService.retirerFavori(id);
        setIsFavori(false);
        alert(`${product.nom} retiré des favoris`);
      } else {
        await favoriService.ajouterFavori(id);
        setIsFavori(true);
        alert(`${product.nom} ajouté aux favoris !`);
      }
    } catch (error) {
      console.error('❌ Erreur gestion favoris:', error);
      alert('Erreur lors de la gestion des favoris');
    } finally {
      setTogglingFavori(false);
    }
  };

  const handleCommandeRapide = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Veuillez vous connecter pour commander');
      navigate('/connexion');
      return;
    }

    if (quantite < 1) {
      alert('Veuillez sélectionner une quantité valide');
      return;
    }

    if (product.quantite < quantite) {
      alert(`Stock insuffisant. Disponible: ${product.quantite}`);
      return;
    }

    try {
      await panierService.ajouterAuPanier(id, quantite);
      navigate('/passer-commande');
    } catch (error) {
      console.error('❌ Erreur commande rapide:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement du produit {id}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Erreur</h3>
        <p>{error}</p>
        <div className="mt-3">
          <Link to="/produits" className="btn btn-warning me-2">
            <i className="bi bi-arrow-left me-1"></i>
            Retour aux produits
          </Link>
          <button className="btn btn-outline-secondary" onClick={loadProduct}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3>Produit non trouvé</h3>
        <p className="text-muted">Le produit avec l'ID {id} n'existe pas</p>
        <Link to="/produits" className="btn btn-warning mt-3">
          <i className="bi bi-arrow-left me-1"></i>
          Retour aux produits
        </Link>
      </div>
    );
  }

  const user = authService.getCurrentUser();

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house me-1"></i>
              Accueil
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/produits">
              <i className="bi bi-grid me-1"></i>
              Produits
            </Link>
          </li>
          {product.categorie && (
            <li className="breadcrumb-item">
              <Link to={`/produits?categorie=${product.categorie.id}`}>
                {product.categorie.nom}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {product.nom}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              {product.imageUrl ? (
                <img 
                  src={getImageUrl(product.imageUrl)} // MODIFIÉ ICI
                  alt={product.nom}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
onError={(e) => {
  e.target.onerror = null;
  e.target.style.display = 'none';
}}
                />
              ) : (
                <div className="bg-light rounded p-5">
                  <i className="bi bi-box display-1 text-muted"></i>
                  <p className="mt-3 text-muted">Pas d'image disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                {product.categorie && (
                  <span className="badge bg-secondary fs-6">
                    {product.categorie.nom}
                  </span>
                )}
                
                {user && (
                  <button 
                    className={`btn ${isFavori ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleToggleFavori}
                    disabled={togglingFavori}
                    title={isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <i className={`bi ${isFavori ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                )}
              </div>
              
              <h1 className="mb-3">{product.nom}</h1>
              <div className="mb-4">
                <span className="display-4 text-warning fw-bold">{product.prix} €</span>
                <span className={`ms-3 badge ${product.quantite > 0 ? 'bg-success' : 'bg-danger'}`}>
                  {product.quantite > 0 ? `${product.quantite} en stock` : 'Rupture de stock'}
                </span>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold">
                  <i className="bi bi-card-text me-2"></i>
                  Description
                </h5>
                <p className="text-muted">{product.description || 'Pas de description disponible'}</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Quantité</label>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    disabled={quantite <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control mx-3 text-center"
                    value={quantite}
                    onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.quantite}
                    style={{ width: '80px' }}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantite(Math.min(product.quantite, quantite + 1))}
                    disabled={quantite >= product.quantite}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <span className="ms-3 text-muted">
                    Max: {product.quantite}
                  </span>
                </div>
              </div>

              <div className="d-grid gap-2 mb-4">
                {product.quantite > 0 ? (
                  <>
                    <button 
                      className="btn btn-warning btn-lg py-3"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                    >
                      {addingToCart ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Ajouter au panier ({quantite})
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="btn btn-success btn-lg py-3"
                      onClick={handleCommandeRapide}
                    >
                      <i className="bi bi-lightning me-2"></i>
                      Commander maintenant
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary btn-lg py-3" disabled>
                    <i className="bi bi-x-circle me-2"></i>
                    Produit indisponible
                  </button>
                )}
                
                {!user && (
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    <Link to="/connexion" className="alert-link">Connectez-vous</Link> pour ajouter au panier ou aux favoris
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-top">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2 text-info"></i>
                  Informations produit
                </h6>
                <div className="row small">
                  <div className="col-md-6 mb-2">
                    <i className="bi bi-upc me-2 text-muted"></i>
                    <span className="text-muted">Référence:</span> {product.id}
                  </div>
                  <div className="col-md-6 mb-2">
                    <i className="bi bi-calendar me-2 text-muted"></i>
                    <span className="text-muted">Disponible:</span> {product.quantite > 0 ? 'Oui' : 'Non'}
                  </div>
                  {product.categorie && (
                    <div className="col-md-6 mb-2">
                      <i className="bi bi-tag me-2 text-muted"></i>
                      <span className="text-muted">Catégorie:</span> {product.categorie.nom}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Link to="/produits" className="btn btn-outline-warning">
              <i className="bi bi-arrow-left me-2"></i>
              Retour aux produits
            </Link>
            
            {user && (
              <div>
                <Link to="/panier" className="btn btn-outline-info me-2">
                  <i className="bi bi-cart me-2"></i>
                  Voir mon panier
                </Link>
                <Link to="/mes-favoris" className="btn btn-outline-danger">
                  <i className="bi bi-heart me-2"></i>
                  Mes favoris
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.categorie && (
        <div className="mt-5 pt-4">
          <h4 className="mb-4">
            <i className="bi bi-box-seam me-2"></i>
            Produits similaires
          </h4>
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Fonctionnalité "Produits similaires" en cours de développement
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;