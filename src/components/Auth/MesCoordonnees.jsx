import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const MesCoordonnees = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    pays: 'France'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/connexion');
      return;
    }
    setCurrentUser(user);
    
    // Charger les coordonnées depuis localStorage ou API
    const savedCoordonnees = localStorage.getItem(`coordonnees_${user.id}`);
    if (savedCoordonnees) {
      setFormData(JSON.parse(savedCoordonnees));
    }
    
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sauvegarder dans localStorage
    if (currentUser) {
      localStorage.setItem(`coordonnees_${currentUser.id}`, JSON.stringify(formData));
    }
    
    // Afficher message de succès
    alert('✅ Coordonnées sauvegardées avec succès !');
  };

  const handleReset = () => {
    setFormData({
      prenom: '',
      nom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      pays: 'France'
    });
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
              <Link to="/mon-compte" className="list-group-item list-group-item-action">
                <i className="bi bi-person me-2"></i>
                Mon Profil
              </Link>
              <Link to="/mes-coordonnees" className="list-group-item list-group-item-action active">
                <i className="bi bi-geo-alt me-2"></i>
                Mes Coordonnées
              </Link>
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
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0 text-warning">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Mes Coordonnées
                  </h2>
                  <p className="text-muted mb-0">Gérez vos informations de livraison et de facturation</p>
                </div>
                <div className="badge bg-warning text-dark">
                  <i className="bi bi-shield-check me-1"></i>
                  Sécurisé
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de coordonnées */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="alert alert-info mb-4">
                <i className="bi bi-info-circle me-2"></i>
                Ces informations seront utilisées pour la livraison de vos commandes.
              </div>

              <form onSubmit={handleSubmit}>
                {/* Section Informations personnelles */}
                <div className="mb-5">
                  <h5 className="text-warning border-bottom pb-2 mb-4">
                    <i className="bi bi-person-badge me-2"></i>
                    Informations personnelles
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-person me-1"></i>
                        Prénom <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="prenom"
                        className="form-control"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-person me-1"></i>
                        Nom <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="nom"
                        className="form-control"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-telephone me-1"></i>
                      Téléphone <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="telephone"
                      className="form-control"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex: 06 12 34 56 78"
                      required
                    />
                  </div>
                </div>

                {/* Section Adresse */}
                <div className="mb-5">
                  <h5 className="text-warning border-bottom pb-2 mb-4">
                    <i className="bi bi-house-door me-2"></i>
                    Adresse de livraison
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-geo-alt me-1"></i>
                      Adresse complète <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="adresse"
                      className="form-control"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Numéro, rue, bâtiment, étage..."
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-mailbox me-1"></i>
                        Code postal <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="codePostal"
                        className="form-control"
                        value={formData.codePostal}
                        onChange={handleChange}
                        placeholder="75000"
                        required
                      />
                    </div>
                    
                    <div className="col-md-8 mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-building me-1"></i>
                        Ville <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="ville"
                        className="form-control"
                        value={formData.ville}
                        onChange={handleChange}
                        placeholder="Paris"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-globe me-1"></i>
                      Pays
                    </label>
                    <select 
                      name="pays"
                      className="form-select"
                      value={formData.pays}
                      onChange={handleChange}
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Canada">Canada</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Section Informations complémentaires */}
                <div className="mb-5">
                  <h5 className="text-warning border-bottom pb-2 mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    Informations complémentaires
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-chat-left-text me-1"></i>
                      Instructions de livraison
                    </label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      placeholder="Ex: Sonner 2 fois, déposer devant la porte, interphone non fonctionnel..."
                    ></textarea>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      id="sameAddress"
                    />
                    <label className="form-check-label" htmlFor="sameAddress">
                      Utiliser la même adresse pour la facturation
                    </label>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="d-flex justify-content-between border-top pt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={handleReset}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Effacer tout
                  </button>
                  
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary me-3"
                      onClick={() => navigate('/mon-compte')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Retour
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-warning fw-bold px-4"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Sauvegarder les coordonnées
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Carte de prévisualisation */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">
                <i className="bi bi-eye me-2"></i>
                Aperçu de vos coordonnées
              </h6>
            </div>
            <div className="card-body">
              {formData.prenom || formData.nom || formData.adresse ? (
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-warning">Adresse de livraison :</h6>
                    <p className="mb-1">
                      <strong>{formData.prenom} {formData.nom}</strong>
                    </p>
                    <p className="mb-1">{formData.adresse}</p>
                    <p className="mb-1">{formData.codePostal} {formData.ville}</p>
                    <p className="mb-1">{formData.pays}</p>
                    <p className="mb-1">
                      <i className="bi bi-telephone me-1"></i>
                      {formData.telephone || 'Non renseigné'}
                    </p>
                  </div>
                  <div className="col-md-6 text-end">
                    <div className="bg-light p-3 rounded">
                      <i className="bi bi-truck fs-1 text-warning"></i>
                      <p className="mt-2 small">
                        Ces coordonnées seront utilisées pour vos futures commandes.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-geo-alt fs-1 mb-3 d-block"></i>
                  <p>Aucune coordonnée enregistrée</p>
                  <p className="small">Remplissez le formulaire ci-dessus pour prévisualiser vos coordonnées</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesCoordonnees;