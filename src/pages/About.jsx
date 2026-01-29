import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="text-center mb-4">À propos de nous</h1>
          <p className="lead text-center mb-5">
            Nous sommes passionnés par l'excellence et l'innovation
          </p>
          
          <div className="card border-0 shadow-lg mb-5">
            <div className="card-body p-5">
              <h3 className="mb-4">Notre mission</h3>
              <p className="mb-4">
                Chez E-Shop, notre mission est de rendre le shopping en ligne aussi simple et agréable que possible. 
                Nous sélectionnons rigoureusement chaque produit pour vous offrir la meilleure qualité au meilleur prix.
              </p>
              
              <h3 className="mb-4">Nos valeurs</h3>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-star-fill text-warning me-3 mt-1"></i>
                    <div>
                      <h5>Qualité</h5>
                      <p className="mb-0">Des produits testés et approuvés</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-shield-check text-success me-3 mt-1"></i>
                    <div>
                      <h5>Sécurité</h5>
                      <p className="mb-0">Transactions 100% sécurisées</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-headset text-primary me-3 mt-1"></i>
                    <div>
                      <h5>Support</h5>
                      <p className="mb-0">Service client disponible 24/7</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-truck text-info me-3 mt-1"></i>
                    <div>
                      <h5>Livraison</h5>
                      <p className="mb-0">Expédition rapide et fiable</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="mb-4">Notre équipe</h3>
              <p>
                Nous sommes une équipe de passionnés du e-commerce qui croit en l'importance 
                d'une expérience client exceptionnelle. Chaque membre de notre équipe travaille 
                dur pour vous offrir le meilleur service possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;