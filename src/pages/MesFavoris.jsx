import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriService } from '../services/favoriService';
import { panierService } from '../services/panierService';
import { getImageUrl } from '../services/api'; // AJOUTE CET IMPORT

const MesFavoris = () => {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoris();
  }, []);

  const loadFavoris = async () => {
    try {
      setLoading(true);
      const response = await favoriService.getMesFavoris();
      console.log('❤️ Favoris chargés:', response.data);
      setFavoris(response.data || []);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavori = async (produitId) => {
    if (!window.confirm('Retirer ce produit des favoris ?')) return;
    
    try {
      await favoriService.retirerFavori(produitId);
      setFavoris(favoris.filter(f => f.produit?.id !== produitId));
      alert('Produit retiré des favoris');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const addToCart = async (produit) => {
    try {
      await panierService.ajouterAuPanier(produit.id, 1);
      alert(`${produit.nom} ajouté au panier !`);
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  // SUPPRIME L'ANCIENNE FONCTION getImageUrl et utilise celle du service

  const removeAllFavoris = async () => {
    if (!window.confirm('Supprimer tous vos favoris ? Cette action est irréversible.')) return;
    
    try {
      const promises = favoris.map(favori => 
        favoriService.retirerFavori(favori.produit?.id || favori.id)
      );
      await Promise.all(promises);
      setFavoris([]);
      alert('Tous les favoris ont été supprimés');
    } catch (error) {
      console.error('Erreur suppression tous:', error);
      alert('Erreur lors de la suppression des favoris');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-warning">
        <i className="bi bi-heart me-2"></i>
        Mes Favoris
      </h1>

      {favoris.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-heartbreak display-1 text-muted mb-3"></i>
            <h3>Aucun produit favori</h3>
            <p className="text-muted">Ajoutez des produits à vos favoris pour les retrouver facilement</p>
            <Link to="/produits" className="btn btn-warning mt-3">
              <i className="bi bi-bag me-2"></i>
              Découvrir les produits
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0">
                <span className="badge bg-warning text-dark fs-6">
                  {favoris.length} produit{favoris.length > 1 ? 's' : ''} favori{favoris.length > 1 ? 's' : ''}
                </span>
              </h5>
              <p className="text-muted small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                Cliquez sur ❤️ pour retirer un produit des favoris
              </p>
            </div>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={removeAllFavoris}
              title="Supprimer tous les favoris"
            >
              <i className="bi bi-trash me-1"></i>
              Tout supprimer
            </button>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {favoris.map((favori) => {
              const produit = favori.produit || favori;
              
              return (
                <div key={produit.id} className="col">
                  <div className="card shadow-sm h-100 border-0">
                    <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                      <div 
                        className="w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                        style={{ 
                          position: 'relative',
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <img 
                          src={getImageUrl(produit.imageUrl)} // MODIFIÉ ICI
                          alt={produit.nom}
                          className="img-fluid h-100"
                          style={{ 
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s ease',
                            padding: '10px'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-image.png'; // MODIFIÉ ICI
                            e.target.className = 'img-fluid h-100 w-100';
                            e.target.style.objectFit = 'cover';
                          }}
                        />
                      </div>
                      
                      <button 
                        className="btn btn-danger btn-sm position-absolute rounded-circle p-2"
                        style={{ top: '10px', right: '10px', zIndex: 1 }}
                        onClick={() => removeFavori(produit.id)}
                        title="Retirer des favoris"
                      >
                        <i className="bi bi-heart-fill"></i>
                      </button>
                      
                      {produit.categorie && (
                        <span className="position-absolute badge bg-secondary"
                          style={{ top: '10px', left: '10px' }}>
                          {produit.categorie.nom}
                        </span>
                      )}
                      
                      <span className={`position-absolute badge ${produit.quantite > 0 ? 'bg-success' : 'bg-danger'}`}
                        style={{ bottom: '10px', right: '10px' }}>
                        {produit.quantite > 0 ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate" title={produit.nom}>
                        {produit.nom}
                      </h5>
                      
                      <p className="card-text text-muted small flex-grow-1">
                        {produit.description?.substring(0, 80) || 'Pas de description disponible'}
                        {produit.description?.length > 80 ? '...' : ''}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="fw-bold text-warning fs-5">{produit.prix} €</span>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => addToCart(produit)}
                            disabled={produit.quantite <= 0}
                            title={produit.quantite <= 0 ? "Produit indisponible" : "Ajouter au panier"}
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Panier
                          </button>
                          <Link 
                            to={`/produits/${produit.id}`}
                            className="btn btn-outline-secondary btn-sm"
                            title="Voir les détails"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-footer bg-white border-top-0 pt-0">
                      <div className="d-grid">
                        <Link 
                          to={`/produits/${produit.id}`}
                          className="btn btn-outline-warning"
                        >
                          <i className="bi bi-info-circle me-2"></i>
                          Voir fiche produit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between">
              <Link to="/produits" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>
                Retour aux produits
              </Link>
              
              <div className="d-flex gap-2">
                <Link to="/panier" className="btn btn-outline-info">
                  <i className="bi bi-cart me-2"></i>
                  Voir mon panier
                </Link>
                <button 
                  className="btn btn-outline-danger"
                  onClick={removeAllFavoris}
                >
                  <i className="bi bi-heartbreak me-2"></i>
                  Vider les favoris
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top">
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted">Produits favoris</h6>
                      <h3 className="text-warning">{favoris.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted">En stock</h6>
                      <h3 className="text-success">
                        {favoris.filter(f => (f.produit || f).quantite > 0).length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted">Prix moyen</h6>
                      <h3 className="text-primary">
                        {(
                          favoris.reduce((acc, f) => acc + (f.produit?.prix || f.prix || 0), 0) / 
                          (favoris.length || 1)
                        ).toFixed(2)} €
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MesFavoris;