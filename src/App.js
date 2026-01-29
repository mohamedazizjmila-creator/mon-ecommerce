import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';
import MesCommandes from './pages/MesCommandes'; // Changé pour User/MesCommandes
import MesFavoris from './pages/MesFavoris';
import MonCompte from './pages/Account/MonCompte';
import MesCoordonnees from './pages/Account/MesCoordonnees';
import PasserCommande from './pages/PasserCommande'; // NOUVEAU : Import de la page PasserCommande
import './App.css';

// Composant de route privée
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user ? children : <Navigate to="/connexion" />;
};

function App() {
  useEffect(() => {
    console.log('🚀 AzizShop Frontend démarré');
  }, []);

  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />
        <main className="main-content flex-grow-1">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produits/:id" element={<ProductDetail />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            
            {/* Routes privées utilisateur */}
            <Route path="/mon-compte" element={<PrivateRoute><MonCompte /></PrivateRoute>} />
            <Route path="/mes-coordonnees" element={<PrivateRoute><MesCoordonnees /></PrivateRoute>} />
            <Route path="/panier" element={<PrivateRoute><Panier /></PrivateRoute>} />
            <Route path="/mes-commandes" element={<PrivateRoute><MesCommandes /></PrivateRoute>} />
            <Route path="/mes-favoris" element={<PrivateRoute><MesFavoris /></PrivateRoute>} />
            
            {/* Route de commande - REMPLACÉE par la vraie page */}
            <Route path="/passer-commande" element={<PrivateRoute><PasserCommande /></PrivateRoute>} />
            
            {/* Route 404 */}
            <Route path="*" element={
              <div className="container text-center py-5">
                <h1 className="text-danger">404</h1>
                <p>Page non trouvée</p>
                <Link to="/" className="btn btn-warning">
                  Retour à l'accueil
                </Link>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;