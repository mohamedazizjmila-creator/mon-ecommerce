import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Tableau de Bord Administrateur</h1>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-box-seam me-2"></i>
                Produits
              </h5>
              <p className="card-text">Gérer les produits du catalogue</p>
              <Link to="/admin/products" className="btn btn-light">
                Gérer les produits
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-tags me-2"></i>
                Catégories
              </h5>
              <p className="card-text">Gérer les catégories de produits</p>
              <Link to="/admin/categories" className="btn btn-light">
                Gérer les catégories
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-people me-2"></i>
                Utilisateurs
              </h5>
              <p className="card-text">Gérer les utilisateurs</p>
              <Link to="/admin/users" className="btn btn-light">
                Gérer les utilisateurs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;