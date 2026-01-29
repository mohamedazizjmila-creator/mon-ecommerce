// MesCommandes.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

const MesCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommandes();
  }, []);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getMesCommandes();
      setCommandes(response.data || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      setError('Impossible de charger les commandes');
      // Si erreur 400, peut-être qu'il n'y a pas de commandes
      if (error.response?.status === 400) {
        setCommandes([]);
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-warning">
        <i className="bi bi-bag-check me-2"></i>
        Mes Commandes
      </h1>

      {error && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!error && commandes.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-bag-x display-1 text-muted mb-3"></i>
            <h3>Aucune commande</h3>
            <p className="text-muted">Vous n'avez pas encore passé de commande</p>
            <Link to="/produits" className="btn btn-warning mt-3">
              <i className="bi bi-bag me-2"></i>
              Voir les produits
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5>Commandes ({commandes.length})</h5>
            {/* Afficher les commandes si elles existent */}
            {commandes.map((commande) => (
              <div key={commande.id} className="border p-3 mb-2">
                <p>Commande #{commande.id}</p>
                <p>Total: {commande.totalAmount} €</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MesCommandes;