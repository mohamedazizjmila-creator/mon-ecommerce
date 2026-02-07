// components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion USER...');
      
      const response = await authService.login(formData);
      
      console.log('✅ Réponse:', response.data);
      
      if (response.data.success) {
        navigate('/');
      } else {
        setError(response.data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('❌ Erreur connexion:', err);
      
      // Messages d'erreur spécifiques
      if (err.message?.includes('comptes admin') || 
          err.message?.includes('Compte admin') ||
          err.message?.includes('panel admin')) {
        setError('❌ ' + err.message + ' Veuillez utiliser le panel d\'administration.');
      } else if (err.response?.status === 401) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur');
      } else {
        setError(err.message || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0">
            <div className="card-header bg-white border-0 pt-4">
              <h3 className="text-center mb-0 text-warning">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Connexion Client
              </h3>
              <p className="text-center text-muted small mb-0">
                Interface réservée aux utilisateurs clients
              </p>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom d'utilisateur"
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Votre mot de passe"
                    disabled={loading}
                  />
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter en tant que Client'
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="mb-0">
                    Pas encore de compte ?{' '}
                    <Link to="/inscription" className="text-warning fw-bold text-decoration-none">
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            
            <div className="card-footer bg-white border-0">
              <div className="alert alert-light border-0 text-center mb-0">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Les administrateurs doivent utiliser le panel d'administration séparé
                </small>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-decoration-none text-dark">
              <i className="bi bi-arrow-left me-1"></i>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;