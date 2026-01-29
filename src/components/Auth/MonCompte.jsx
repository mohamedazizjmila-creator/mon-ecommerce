import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const MonCompte = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profil');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/connexion');
      return;
    }
    setCurrentUser(user);
    setLoading(false);
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Logique pour mettre à jour le profil
    alert('Profil mis à jour !');
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
      <div className="row">
        {/* Sidebar navigation */}
        <div className="col-lg-3 mb-4">
          <div className="card border-warning shadow-sm">
            <div className="card-header bg-warning text-dark fw-bold">
              <i className="bi bi-person-circle me-2"></i>
              Mon Espace
            </div>
            <div className="list-group list-group-flush">
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'profil' ? 'active' : ''}`}
                onClick={() => setActiveTab('profil')}
              >
                <i className="bi bi-person me-2"></i>
                Mon Profil
              </button>
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'coordonnees' ? 'active' : ''}`}
                onClick={() => setActiveTab('coordonnees')}
              >
                <i className="bi bi-geo-alt me-2"></i>
                Mes Coordonnées
              </button>
              <Link to="/mes-commandes" className="list-group-item list-group-item-action">
                <i className="bi bi-bag-check me-2"></i>
                Mes Commandes
              </Link>
              <Link to="/mes-favoris" className="list-group-item list-group-item-action">
                <i className="bi bi-heart me-2"></i>
                Mes Favoris
              </Link>
              <button 
                className="list-group-item list-group-item-action text-danger"
                onClick={() => {
                  authService.logout();
                  navigate('/');
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-lg-9">
          {/* En-tête */}
          <div className="card border-warning shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0">
              <h2 className="mb-0 text-warning">
                <i className="bi bi-person-circle me-2"></i>
                Mon Compte
              </h2>
              <p className="text-muted mb-0">Gérez vos informations personnelles</p>
            </div>
          </div>

          {/* Onglets */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {activeTab === 'profil' ? (
                <>
                  <h4 className="text-warning mb-4">
                    <i className="bi bi-person me-2"></i>
                    Informations personnelles
                  </h4>
                  
                  <div className="row mb-4">
                 
                    
                    <div className="col-md-9">
                      <form onSubmit={handleUpdateProfile}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Nom d'utilisateur</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={currentUser.username || ''}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={currentUser.email || ''}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Rôle</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={currentUser.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date d'inscription</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Non disponible'}
                              readOnly
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Nouveau mot de passe</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Laisser vide pour ne pas changer"
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Confirmer le mot de passe</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Confirmer le nouveau mot de passe"
                          />
                        </div>
                        
                        <div className="d-flex justify-content-end">
                          <button type="submit" className="btn btn-warning">
                            <i className="bi bi-check-circle me-2"></i>
                            Mettre à jour
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-warning mb-4">
                    <i className="bi bi-geo-alt me-2"></i>
                    Mes Coordonnées
                  </h4>
                  
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Cette section est en cours de développement.
                  </div>
                  
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Prénom</label>
                        <input type="text" className="form-control" placeholder="Votre prénom" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nom</label>
                        <input type="text" className="form-control" placeholder="Votre nom" />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Adresse</label>
                      <input type="text" className="form-control" placeholder="Numéro et rue" />
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Code postal</label>
                        <input type="text" className="form-control" placeholder="CP" />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label">Ville</label>
                        <input type="text" className="form-control" placeholder="Ville" />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input type="tel" className="form-control" placeholder="Votre numéro" />
                    </div>
                    
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-warning">
                        <i className="bi bi-save me-2"></i>
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonCompte;