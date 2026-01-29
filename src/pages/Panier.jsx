import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { panierService } from '../services/panierService';

const Panier = () => {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPanier();
  }, []);

  const loadPanier = async () => {
    try {
      setLoading(true);
      const response = await panierService.getMonPanier();
      console.log('📦 Panier chargé:', response.data);
      setPanier(response.data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantite = async (produitId, quantite) => {
    try {
      await panierService.updateQuantite(produitId, quantite);
      loadPanier();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const removeItem = async (produitId) => {
    if (!window.confirm('Retirer ce produit ?')) return;
    
    try {
      await panierService.retirerDuPanier(produitId);
      loadPanier();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const viderPanier = async () => {
    if (!window.confirm('Vider le panier ?')) return;
    
    try {
      await panierService.viderPanier();
      setPanier({ items: [], total: 0 });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/100x100?text=No+Image';
    }
    
    // Si l'URL commence déjà par http, la retourner telle quelle
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Sinon, ajouter l'URL du backend
    return `http://localhost:8080${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const items = panier?.items || [];
  const total = panier?.total || 0;

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-warning">
        <i className="bi bi-cart me-2"></i>
        Mon Panier
      </h1>

      {items.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
            <h3>Panier vide</h3>
            <Link to="/produits" className="btn btn-warning mt-3">
              Voir les produits
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">{items.length} article(s) dans votre panier</h5>
                </div>
                <div className="card-body">
                  {items.map((item) => (
                    <div key={item.id} className="d-flex border-bottom pb-3 mb-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={getImageUrl(item.produit?.imageUrl)} 
                          alt={item.produit?.nom || 'Produit'}
                          className="rounded"
                          style={{ 
                            width: '120px', 
                            height: '120px', 
                            objectFit: 'cover',
                            backgroundColor: '#f8f9fa'
                          }}
                          onError={(e) => {
                            // En cas d'erreur de chargement de l'image
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/120x120?text=Image+non+disponible';
                          }}
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="mb-1">{item.produit?.nom || 'Produit sans nom'}</h5>
                            <p className="text-muted small mb-2">
                              {item.produit?.description?.substring(0, 100) || 'Pas de description'}
                              {item.produit?.description?.length > 100 ? '...' : ''}
                            </p>
                            {item.produit?.categorie && (
                              <span className="badge bg-secondary">
                                {item.produit.categorie.nom}
                              </span>
                            )}
                          </div>
                          <div className="text-end">
                            <h5 className="text-warning">{item.produit?.prix || 0} €</h5>
                            <p className="text-muted small mb-0">unité</p>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantite(item.produit?.id, item.quantite - 1)}
                              disabled={item.quantite <= 1}
                              title="Diminuer la quantité"
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="mx-3 fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
                              {item.quantite}
                            </span>
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantite(item.produit?.id, item.quantite + 1)}
                              title="Augmenter la quantité"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          
                          <div className="d-flex align-items-center">
                            <span className="fw-bold me-3">
                              Sous-total: {(item.produit?.prix * item.quantite || 0).toFixed(2)} €
                            </span>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeItem(item.produit?.id)}
                              title="Retirer du panier"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-warning text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Récapitulatif
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Articles ({items.length})</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Livraison</span>
                    <span className="text-success">
                      <i className="bi bi-truck me-1"></i>
                      Gratuite
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total TTC</span>
                    <span className="text-warning">{total.toFixed(2)} €</span>
                  </div>
                  
                  {/* BOUTON MODIFIÉ : Remplacement du alert par Link */}
                  <Link 
                    to="/passer-commande" 
                    className="btn btn-warning w-100 mt-4 py-3 fw-bold"
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Passer commande
                  </Link>
                  
                  <div className="mt-3 text-center">
                    <Link to="/produits" className="btn btn-outline-secondary w-100 mb-2">
                      <i className="bi bi-bag me-2"></i>
                      Continuer mes achats
                    </Link>
                    <button 
                      className="btn btn-outline-danger w-100"
                      onClick={viderPanier}
                    >
                      <i className="bi bi-cart-x me-2"></i>
                      Vider le panier
                    </button>
                  </div>
                  
                  <p className="small text-muted text-center mt-3">
                    <i className="bi bi-shield-check me-1"></i>
                    Paiement sécurisé SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <Link to="/produits" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Retour aux produits
            </Link>
            <div>
              <Link to="/mes-favoris" className="btn btn-outline-info me-2">
                <i className="bi bi-heart me-2"></i>
                Voir mes favoris
              </Link>
              <Link to="/mes-commandes" className="btn btn-outline-warning">
                <i className="bi bi-bag-check me-2"></i>
                Mes commandes
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Panier;