import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Section AzizShop */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 text-warning">
              <i className="bi bi-shop-window me-2"></i>
              AzizShop
            </h5>
            <p className="text-light" style={{ opacity: 0.8 }}>
              Votre boutique en ligne préférée. Découvrez les meilleurs produits 
              aux prix les plus compétitifs. Recherche facile et authentification sécurisée.
            </p>
            <div className="social-links">
              {/* REMPLACER AVEC VOTRE LIEN FACEBOOK */}
              <a href="https://www.facebook.com/aziz.jmila/directory_links" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-warning me-3">
                <i className="bi bi-facebook"></i>
              </a>
              
              {/* REMPLACER AVEC VOTRE LIEN TWITTER/X */}
              <a href="https://x.com/mr_killer57646" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-warning me-3">
                <i className="bi bi-twitter"></i>
              </a>
              
              {/* REMPLACER AVEC VOTRE LIEN INSTAGRAM */}
              <a href="https://instagram.com/jmilaaziz" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-warning me-3">
                <i className="bi bi-instagram"></i>
              </a>
              
              {/* REMPLACER AVEC VOTRE LIEN WHATSAPP */}
              <a href="https://wa.me/21622483565" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-warning">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="col-md-2 mb-4">
            <h5 className="mb-3 text-light">Navigation</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>
                  <i className="bi bi-chevron-right me-1"></i>
                  Accueil
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/produits" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>
                  <i className="bi bi-chevron-right me-1"></i>
                  Produits
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/connexion" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>
                  <i className="bi bi-chevron-right me-1"></i>
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3 text-light">Catégories</h5>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-warning text-dark">Électronique</span>
              <span className="badge bg-warning text-dark">Vêtements</span>
              <span className="badge bg-warning text-dark">Maison</span>
              <span className="badge bg-warning text-dark">Sports</span>
              <span className="badge bg-warning text-dark">Beauté</span>
            </div>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3 text-light">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt text-warning me-2"></i>
                <span style={{ opacity: 0.8 }}>Nabeul, Tunisie</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope text-warning me-2"></i>
                <span style={{ opacity: 0.8 }}>mohamedazizjmila@gmail.com</span>
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone text-warning me-2"></i>
                <span style={{ opacity: 0.8 }}>+216 22 483 565</span>
              </li>
              <li>
                <i className="bi bi-clock text-warning me-2"></i>
                <span style={{ opacity: 0.8 }}>Lun-Sam: 8h-20h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <hr className="bg-warning my-3" />

        {/* Copyright */}
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0" style={{ opacity: 0.8 }}>
              &copy; {currentYear} <span className="text-warning">AzizShop</span>. Tous droits réservés.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0" style={{ opacity: 0.8 }}>
              Développé avec <i className="bi bi-heart-fill text-danger mx-1"></i> 
              pour votre shopping en ligne
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;