// components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setLoading(true);

    try {
      console.log('🔄 Début de l\'inscription...');
      
      const result = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('📋 Réponse du serveur:', result.data);
      
      if (result.data.success) {
        alert('🎉 Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        navigate('/connexion');
      } else {
        setError(result.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('💥 Erreur complète:', err);
      
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Erreur serveur: ' + err.response.status);
        }
      } else if (err.request) {
        setError('Impossible de se connecter au serveur.');
      } else {
        setError('Erreur: ' + err.message);
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
                <i className="bi bi-person-plus me-2"></i>
                Créer un compte AzizShop
              </h3>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError('')}
                    aria-label="Fermer"
                  ></button>
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
                    placeholder="Choisissez un nom d'utilisateur unique"
                    minLength="3"
                    maxLength="30"
                  />
                  <div className="form-text">3 à 30 caractères</div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="exemple@email.com"
                  />
                </div>
                
                <div className="mb-3">
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
                    placeholder="Minimum 6 caractères"
                    minLength="6"
                  />
                  <div className="form-text">Au moins 6 caractères</div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirmez votre mot de passe"
                    minLength="6"
                  />
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Création du compte...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Créer mon compte
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="mb-2">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/connexion" className="text-warning fw-bold text-decoration-none">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Se connecter
                    </Link>
                  </p>
                  <p className="mb-0 small text-muted">
                    En vous inscrivant, vous acceptez nos conditions d'utilisation.
                  </p>
                </div>
              </form>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4 text-center">
              <Link to="/" className="text-decoration-none text-dark">
                <i className="bi bi-arrow-left me-1"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
          
          <div className="alert alert-light border mt-4" role="alert">
            <h6 className="alert-heading">
              <i className="bi bi-lightbulb text-warning me-2"></i>
              Conseils pour votre compte
            </h6>
            <ul className="mb-0 small">
              <li>Choisissez un nom d'utilisateur facile à retenir</li>
              <li>Utilisez un mot de passe fort avec chiffres et lettres</li>
              <li>Gardez vos informations de connexion en sécurité</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;