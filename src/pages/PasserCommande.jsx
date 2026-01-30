import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { panierService } from '../services/panierService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { getImageUrl } from '../services/api'; // AJOUTE CET IMPORT

const PasserCommande = () => {
  const navigate = useNavigate();
  
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [methodePaiement, setMethodePaiement] = useState('CARTE_BANCAIRE');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadPanier();
  }, []);

  const loadPanier = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await panierService.getMonPanier();
      console.log('📦 Panier chargé pour commande:', response.data);
      
      setPanier(response.data);
      
      const user = authService.getCurrentUser();
      if (user && user.adresse) {
        setAdresseLivraison(user.adresse);
      }
      
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setError('Impossible de charger votre panier');
    } finally {
      setLoading(false);
    }
  };

  const calculerTotal = () => {
    if (!panier?.items || panier.items.length === 0) return 0;
    
    return panier.items.reduce((total, item) => {
      const prix = item.produit?.prix || 0;
      const quantite = item.quantite || 1;
      return total + (prix * quantite);
    }, 0);
  };

  const validerFormulaire = () => {
    if (!adresseLivraison.trim()) {
      setError('Veuillez saisir une adresse de livraison');
      return false;
    }

    if (!panier?.items || panier.items.length === 0) {
      setError('Votre panier est vide');
      return false;
    }

    return true;
  };

  const passerCommande = async () => {
    if (!validerFormulaire()) return;

    try {
      setSubmitting(true);
      setError('');
      
      console.log('🛒 Passage de commande...');
      
      const response = await orderService.creerCommande(adresseLivraison, methodePaiement);
      
      console.log('✅ Commande créée:', response.data);
      
      setSuccess(`Commande #${response.data.id} passée avec succès !`);
      
      setTimeout(() => {
        navigate('/mes-commandes');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Erreur lors de la commande:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  // SUPPRIME L'ANCIENNE FONCTION getImageUrl et utilise celle du service

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement de votre panier...</p>
      </div>
    );
  }

  const items = panier?.items || [];
  const total = calculerTotal();
  const tva = total * 0.20;
  const totalTTC = total + tva;

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house me-1"></i>
              Accueil
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/panier">
              <i className="bi bi-cart me-1"></i>
              Panier
            </Link>
          </li>
          <li className="breadcrumb-item active">
            <i className="bi bi-bag-check me-1"></i>
            Passer commande
          </li>
        </ol>
      </nav>

      <h1 className="mb-4 text-warning">
        <i className="bi bi-bag-check me-2"></i>
        Finaliser votre commande
      </h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Informations de livraison</h4>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <label htmlFor="adresseLivraison" className="form-label fw-bold">
                  Adresse de livraison complète *
                </label>
                <textarea
                  id="adresseLivraison"
                  className="form-control"
                  rows="3"
                  value={adresseLivraison}
                  onChange={(e) => setAdresseLivraison(e.target.value)}
                  placeholder="Ex: 123 Rue de la Paix, 75001 Paris, France"
                  required
                />
                <div className="form-text">
                  Assurez-vous que l'adresse est complète pour une livraison réussie.
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Méthode de paiement *</label>
                <div className="row">
                  {[
                    { id: 'CARTE_BANCAIRE', label: '💳 Carte bancaire', icon: 'bi-credit-card' },
                    { id: 'PAYPAL', label: '💰 PayPal', icon: 'bi-paypal' },
                    { id: 'VIREMENT_BANCAIRE', label: '🏦 Virement bancaire', icon: 'bi-bank' },
                    { id: 'ESPECES', label: '💵 Espèces à la livraison', icon: 'bi-cash' }
                  ].map((method) => (
                    <div key={method.id} className="col-md-6 mb-2">
                      <div className={`form-check card ${methodePaiement === method.id ? 'border-warning' : ''}`}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="methodePaiement"
                          id={`paiement-${method.id}`}
                          value={method.id}
                          checked={methodePaiement === method.id}
                          onChange={(e) => setMethodePaiement(e.target.value)}
                          style={{ position: 'absolute', top: '10px', left: '10px' }}
                        />
                        <label className="form-check-label card-body" htmlFor={`paiement-${method.id}`}>
                          <div className="d-flex align-items-center">
                            <i className={`bi ${method.icon} fs-4 me-3`}></i>
                            <div>
                              <div className="fw-bold">{method.label}</div>
                              {method.id === 'ESPECES' && (
                                <small className="text-muted">Paiement à la réception</small>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="notes" className="form-label fw-bold">
                  Notes pour la livraison (optionnel)
                </label>
                <textarea
                  id="notes"
                  className="form-control"
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sonner au portail rouge, livraison en soirée..."
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-warning btn-lg py-3"
                  onClick={passerCommande}
                  disabled={submitting || items.length === 0}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Confirmer et payer {totalTTC.toFixed(2)} €
                    </>
                  )}
                </button>
                
                <Link to="/panier" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour au panier
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success mt-3">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <div className="mt-2">
                    <small>Redirection vers vos commandes...</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Récapitulatif de la commande
              </h5>
            </div>
            <div className="card-body">
              {items.length === 0 ? (
                <div className="text-center py-3">
                  <i className="bi bi-cart-x text-muted fs-1"></i>
                  <p className="mt-2">Votre panier est vide</p>
                </div>
              ) : (
                <>
                  <h6 className="mb-3">Articles ({items.length})</h6>
                  <div className="list-group list-group-flush mb-3">
                    {items.slice(0, 3).map((item, index) => (
                      <div key={index} className="list-group-item px-0 py-2">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-light rounded" style={{ width: '60px', height: '60px' }}>
                              {item.produit?.imageUrl ? (
                                <img
                                  src={getImageUrl(item.produit.imageUrl)} // MODIFIÉ ICI
                                  alt={item.produit.nom}
                                  className="img-fluid rounded"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                  <i className="bi bi-box text-warning"></i>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 small">{item.produit?.nom || 'Produit'}</h6>
                            <div className="d-flex justify-content-between small">
                              <span className="text-muted">
                                {item.quantite} × {item.produit?.prix?.toFixed(2)} €
                              </span>
                              <span className="fw-bold">
                                {(item.quantite * (item.produit?.prix || 0)).toFixed(2)} €
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {items.length > 3 && (
                      <div className="list-group-item px-0 py-2 text-center">
                        <span className="text-muted small">
                          + {items.length - 3} autre(s) article(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <hr />

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Sous-total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Livraison</span>
                      <span className="text-success">Gratuite</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>TVA (20%)</span>
                      <span>{tva.toFixed(2)} €</span>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5 fw-bold">
                    <span>Total TTC</span>
                    <span className="text-warning">{totalTTC.toFixed(2)} €</span>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="alert alert-info small">
                      <i className="bi bi-info-circle me-1"></i>
                      Livraison estimée: 3-5 jours ouvrés
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-shield-check text-success fs-4 me-3"></i>
                <div>
                  <h6 className="mb-0">Paiement sécurisé</h6>
                  <small className="text-muted">SSL 256-bit encryption</small>
                </div>
              </div>
              <p className="small text-muted mb-0">
                Vos informations de paiement sont protégées. Nous ne stockons jamais vos données bancaires.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-top">
        <div className="row">
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-truck text-warning fs-2 mb-2 d-block"></i>
            <h6>Livraison rapide</h6>
            <small className="text-muted">3-5 jours ouvrés</small>
          </div>
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-arrow-return-left text-warning fs-2 mb-2 d-block"></i>
            <h6>Retours gratuits</h6>
            <small className="text-muted">30 jours pour retourner</small>
          </div>
          <div className="col-md-4 text-center mb-3">
            <i className="bi bi-headset text-warning fs-2 mb-2 d-block"></i>
            <h6>Support 7j/7</h6>
            <small className="text-muted">Assistance client</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasserCommande;