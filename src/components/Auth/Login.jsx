// components/Auth/Login.jsx - Version corrigée sans AuthContext
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
      console.log('🔐 Début login...');
      
      // Utiliser directement authService
      const response = await authService.login(formData);
      
      console.log('✅ Login réussi:', response.data);
      
      if (response.data.success) {
        // Vérification email requise ?
        if (response.data.requiresVerification) {
          setError('Veuillez vérifier votre email avant de vous connecter');
          // Rediriger vers la page de vérification
          navigate('/verify-email', { 
            state: { email: response.data.email } 
          });
          return;
        }
        
        // Rediriger vers la page d'accueil
        navigate('/');
      } else {
        setError(response.data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      
      // Messages d'erreur spécifiques
      if (err.response?.status === 401) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (err.response?.status === 404) {
        setError('Service d\'authentification non disponible');
      } else if (err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le serveur Spring est démarré');
      } else {
        setError('Erreur de connexion: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      console.log('🔐 Tentative de connexion Google...');
      
      // Simuler un token Google (à remplacer par le vrai)
      const googleToken = 'simulated-google-token';
      
      const response = await authService.googleLogin({ token: googleToken });
      
      if (response.data.success) {
        console.log('✅ Google login réussi');
        navigate('/');
      } else {
        setError('Erreur de connexion Google: ' + response.data.message);
      }
    } catch (err) {
      console.error('❌ Erreur Google login:', err);
      setError('Erreur de connexion avec Google');
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
                Connexion à AzizShop
              </h3>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {/* Bouton Google Login */}
              <div className="mb-4">
                <button 
                  className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="me-2" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </button>
              </div>
              
              <div className="position-relative text-center mb-4">
                <hr />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                  OU
                </span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom d'utilisateur</label>
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
                  <label className="form-label">Mot de passe</label>
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
                      'Se connecter'
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
                  <p className="mb-0 mt-2">
                    <Link to="/verify-email" className="text-decoration-none text-muted small">
                      Problème de vérification email ?
                    </Link>
                  </p>
                </div>
              </form>
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