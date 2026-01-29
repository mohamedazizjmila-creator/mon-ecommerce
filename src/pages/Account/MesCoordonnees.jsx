import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [itemsCommande, setItemsCommande] = useState([]);
  const [chargementItems, setChargementItems] = useState(false);

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getMesCommandes();
      console.log('📦 Commandes chargées:', response.data);
      
      // Trier par date (plus récent d'abord)
      const commandesTriees = Array.isArray(response.data) 
        ? response.data.sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande))
        : [];
      
      setCommandes(commandesTriees);
      
      // Sélectionner la première commande si disponible
      if (commandesTriees.length > 0) {
        chargerDetailsCommande(commandesTriees[0].id);
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      setError('Impossible de charger vos commandes');
      // Si erreur 400, peut-être qu'il n'y a pas de commandes
      if (error.response?.status === 400) {
        setCommandes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const chargerDetailsCommande = async (commandeId) => {
    try {
      setChargementItems(true);
      
      // Charger la commande
      const commandeResponse = await orderService.getCommande(commandeId);
      setCommandeSelectionnee(commandeResponse.data);
      
      // Charger les items de la commande
      const itemsResponse = await orderService.getOrderItems(commandeId);
      setItemsCommande(itemsResponse.data || []);
      
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      // Essayer de récupérer les items depuis la commande elle-même
      if (commandeSelectionnee?.orderItems) {
        setItemsCommande(commandeSelectionnee.orderItems);
      }
    } finally {
      setChargementItems(false);
    }
  };

  const annulerCommande = async (commandeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    try {
      await orderService.annulerCommande(commandeId);
      alert('Commande annulée avec succès');
      loadCommandes(); // Recharger la liste
    } catch (error) {
      console.error('Erreur annulation:', error);
      alert(error.response?.data?.error || 'Impossible d\'annuler la commande');
    }
  };

  // Formater la date
  const formaterDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la couleur du statut
  const getCouleurStatut = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
      case 'EN_TRAITEMENT': return 'info';
      case 'CONFIRMEE': return 'primary';
      case 'EXPEDIEE': return 'warning';
      case 'LIVREE': return 'success';
      case 'ANNULEE': return 'danger';
      default: return 'secondary';
    }
  };

  // Obtenir le libellé du statut
  const getLibelleStatut = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_TRAITEMENT': return 'En traitement';
      case 'CONFIRMEE': return 'Confirmée';
      case 'EXPEDIEE': return 'Expédiée';
      case 'LIVREE': return 'Livrée';
      case 'ANNULEE': return 'Annulée';
      default: return statut;
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement de vos commandes...</p>
      </div>
    );
  }

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
            <Link to="/mon-compte">
              <i className="bi bi-person me-1"></i>
              Mon compte
            </Link>
          </li>
          <li className="breadcrumb-item active">
            <i className="bi bi-bag-check me-1"></i>
            Mes commandes
          </li>
        </ol>
      </nav>

      <h1 className="mb-4 text-warning">
        <i className="bi bi-bag-check me-2"></i>
        Mes Commandes
      </h1>

      {error && !commandes.length && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!error && commandes.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-bag-x display-1 text-muted mb-3"></i>
            <h3>Aucune commande</h3>
            <p className="text-muted mb-4">
              Vous n'avez pas encore passé de commande sur AzizShop
            </p>
            <Link to="/produits" className="btn btn-warning me-2">
              <i className="bi bi-bag me-2"></i>
              Découvrir les produits
            </Link>
            <Link to="/panier" className="btn btn-outline-warning">
              <i className="bi bi-cart me-2"></i>
              Voir mon panier
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Liste des commandes */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Historique ({commandes.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {commandes.map((commande) => (
                    <div
                      key={commande.id}
                      className={`list-group-item list-group-item-action ${
                        commandeSelectionnee?.id === commande.id ? 'active' : ''
                      }`}
                      onClick={() => chargerDetailsCommande(commande.id)}
                      style={{ cursor: 'pointer', borderLeft: '4px solid transparent' }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Commande #{commande.id}</h6>
                          <small className={commandeSelectionnee?.id === commande.id ? 'text-white-50' : 'text-muted'}>
                            {formaterDate(commande.dateCommande)}
                          </small>
                          <div className="mt-2">
                            <span className={`badge bg-${getCouleurStatut(commande.statut)}`}>
                              {getLibelleStatut(commande.statut)}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{commande.total?.toFixed(2) || '0.00'} €</div>
                          <small className={commandeSelectionnee?.id === commande.id ? 'text-white-50' : 'text-muted'}>
                            {commande.items?.length || '?'} article(s)
                          </small>
                        </div>
                      </div>
                      
                      {/* Bouton annuler si commande en attente */}
                      {(commande.statut === 'EN_ATTENTE' || commande.statut === 'EN_TRAITEMENT') && (
                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              annulerCommande(commande.id);
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="col-lg-7">
            {commandeSelectionnee ? (
              <div className="card shadow-sm">
                <div className="card-header bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Détails de la commande #{commandeSelectionnee.id}
                  </h5>
                </div>
                <div className="card-body">
                  {/* Informations générales */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <h6>Informations commande</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Date</strong></td>
                            <td>{formaterDate(commandeSelectionnee.dateCommande)}</td>
                          </tr>
                          <tr>
                            <td><strong>Statut</strong></td>
                            <td>
                              <span className={`badge bg-${getCouleurStatut(commandeSelectionnee.statut)}`}>
                                {getLibelleStatut(commandeSelectionnee.statut)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Référence</strong></td>
                            <td>#{commandeSelectionnee.id}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <h6>Paiement & Livraison</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Méthode</strong></td>
                            <td>{commandeSelectionnee.paymentMethod || 'Non spécifié'}</td>
                          </tr>
                          <tr>
                            <td><strong>Total</strong></td>
                            <td className="fw-bold text-warning">
                              {commandeSelectionnee.total?.toFixed(2) || '0.00'} €
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div className="mb-4">
                    <h6>
                      <i className="bi bi-truck me-2"></i>
                      Adresse de livraison
                    </h6>
                    <div className="border rounded p-3 bg-light">
                      <p className="mb-0">
                        {commandeSelectionnee.shippingAddress || 'Adresse non spécifiée'}
                      </p>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  <div className="mb-4">
                    <h6>
                      <i className="bi bi-box-seam me-2"></i>
                      Articles ({itemsCommande.length})
                    </h6>
                    {chargementItems ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-warning"></div>
                        <p className="mt-2">Chargement des articles...</p>
                      </div>
                    ) : itemsCommande.length > 0 ? (
                      <div className="list-group">
                        {itemsCommande.map((item, index) => (
                          <div key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold">{item.produit?.nom || 'Article'}</div>
                                <small className="text-muted">
                                  Réf: {item.produit?.id || 'N/A'} • 
                                  Quantité: {item.quantite || 1}
                                </small>
                              </div>
                              <div className="text-end">
                                <div>{item.prixUnitaire?.toFixed(2) || '0.00'} €</div>
                                <small className="text-muted">
                                  Total: {(item.quantite * (item.prixUnitaire || 0)).toFixed(2)} €
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Aucun détail d'article disponible
                      </div>
                    )}
                  </div>

                  {/* Total de la commande */}
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total de la commande</span>
                      <span className="text-warning">
                        {commandeSelectionnee.total?.toFixed(2) || '0.00'} €
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Pour toute question, contactez notre service client
                    </small>
                    <Link to="/contact" className="btn btn-sm btn-outline-warning">
                      <i className="bi bi-headset me-1"></i>
                      Support
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-bag display-1 text-muted mb-3"></i>
                  <h5>Sélectionnez une commande</h5>
                  <p className="text-muted">
                    Cliquez sur une commande dans la liste pour voir ses détails
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 pt-3 border-top">
        <div className="d-flex justify-content-between">
          <Link to="/mon-compte" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Retour à mon compte
          </Link>
          <div>
            <Link to="/panier" className="btn btn-outline-warning me-2">
              <i className="bi bi-cart me-2"></i>
              Voir mon panier
            </Link>
            <Link to="/produits" className="btn btn-warning">
              <i className="bi bi-bag me-2"></i>
              Nouvelle commande
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesCommandes;