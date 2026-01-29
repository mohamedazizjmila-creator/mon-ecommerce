import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };

    checkAuth();
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo AzizShop */}
        <Link className="navbar-brand fw-bold text-warning" to="/">
          <i className="bi bi-shop-window me-2"></i>
          AzizShop
        </Link>

        {/* Bouton menu mobile */}
        <button 
          className="navbar-toggler border-warning" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenu du menu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Barre de recherche dans la navbar */}
          <form onSubmit={handleSearch} className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-warning"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-warning" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Menu utilisateur */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active text-warning' : 'text-light'}`}
                to="/"
              >
                <i className="bi bi-house me-1"></i>
                Accueil
              </Link>
            </li>
            
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/produits' ? 'active text-warning' : 'text-light'}`}
                to="/produits"
              >
                <i className="bi bi-grid me-1"></i>
                Produits
              </Link>
            </li>

            {/* Icône Panier simple */}
            <li className="nav-item me-3">
              <Link 
                className={`nav-link ${location.pathname === '/panier' ? 'active text-warning' : 'text-light'}`}
                to="/panier"
                title="Mon panier"
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span className="d-lg-none ms-2">Panier</span>
              </Link>
            </li>

            {/* Icône Favoris */}
            <li className="nav-item me-3">
              <Link 
                className={`nav-link ${location.pathname === '/mes-favoris' ? 'active text-warning' : 'text-light'}`}
                to="/mes-favoris"
                title="Mes favoris"
              >
                <i className="bi bi-heart fs-5"></i>
                <span className="d-lg-none ms-2">Favoris</span>
              </Link>
            </li>

            {/* Affichage de l'état de connexion */}
            {!loading && (
              currentUser ? (
                // UTILISATEUR CONNECTÉ - BOUTON CARRÉ 3 TRAITS
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle p-1" href="#" role="button" data-bs-toggle="dropdown">
                    {/* Bouton carré avec 3 traits */}
                    <div className="d-flex align-items-center justify-content-center" 
                         style={{
                           width: '40px',
                           height: '40px',
                           backgroundColor: 'rgba(255, 193, 7, 0.2)',
                           border: '1px solid #ffc107',
                           borderRadius: '5px',
                           cursor: 'pointer'
                         }}>
                      {/* 3 traits horizontaux */}
                      <div className="d-flex flex-column align-items-center">
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#ffc107',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#ffc107',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#ffc107',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                      </div>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* En-tête avec nom d'utilisateur */}
                    <li className="dropdown-header text-warning fw-bold">
                      <i className="bi bi-person-circle me-2"></i>
                      {currentUser.username}
                      {currentUser.role === 'ADMIN' && (
                        <span className="badge bg-warning text-dark ms-2">ADMIN</span>
                      )}
                    </li>
                    <li>
                      <span className="dropdown-item-text text-muted small">
                        <i className="bi bi-envelope me-2"></i>
                        {currentUser.email}
                      </span>
                    </li>
                    <li>
                      <span className="dropdown-item-text text-muted small">
                        <i className="bi bi-person-badge me-2"></i>
                        {currentUser.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    
                    <li>
                      <Link className="dropdown-item" to="/mon-compte">
                        <i className="bi bi-person-gear me-2"></i>
                        Mon compte
                      </Link>
                    </li>
                    
                    <li>
                      <Link className="dropdown-item" to="/mes-favoris">
                        <i className="bi bi-heart me-2"></i>
                        Mes favoris
                      </Link>
                    </li>
                    
                    <li>
                      <Link className="dropdown-item" to="/panier">
                        <i className="bi bi-cart3 me-2"></i>
                        Mon panier
                      </Link>
                    </li>
                    
                    <li>
                      <Link className="dropdown-item" to="/mes-commandes">
                        <i className="bi bi-bag-check me-2"></i>
                        Mes commandes
                      </Link>
                    </li>
                    
                    {currentUser.role === 'ADMIN' && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/admin">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Tableau de bord
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/produits">
                            <i className="bi bi-box-seam me-2"></i>
                            Gérer produits
                          </Link>
                        </li>
                      </>
                    )}
                    
                    <li><hr className="dropdown-divider" /></li>
                    
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                // UTILISATEUR NON CONNECTÉ - BOUTON CARRÉ 3 TRAITS GRIS
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle p-1" href="#" role="button" data-bs-toggle="dropdown">
                    {/* Bouton carré gris avec 3 traits */}
                    <div className="d-flex align-items-center justify-content-center" 
                         style={{
                           width: '40px',
                           height: '40px',
                           backgroundColor: 'rgba(108, 117, 125, 0.2)',
                           border: '1px solid #6c757d',
                           borderRadius: '5px',
                           cursor: 'pointer'
                         }}>
                      {/* 3 traits horizontaux gris */}
                      <div className="d-flex flex-column align-items-center">
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#6c757d',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#6c757d',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                        <div style={{
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#6c757d',
                          margin: '2px 0',
                          borderRadius: '1px'
                        }}></div>
                      </div>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li className="dropdown-header text-secondary">
                      <i className="bi bi-person me-2"></i>
                      Non connecté
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/connexion">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Connexion
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/inscription">
                        <i className="bi bi-person-plus me-2"></i>
                        Inscription
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/panier">
                        <i className="bi bi-cart3 me-2"></i>
                        Mon panier
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bi bi-question-circle me-2"></i>
                        Aide
                      </a>
                    </li>
                  </ul>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;