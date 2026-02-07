// components/Auth/Register.jsx - Version SIMPLE
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
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Vérifier le username en temps réel
    if (name === 'username' && value.length >= 3) {
      checkUsernameAvailability(value);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const exists = await authService.checkUsername(username);
      setUsernameAvailable(!exists);
    } catch (err) {
      console.error('Erreur vérification username:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
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
    
    if (!usernameAvailable) {
      setError('Ce nom d\'utilisateur est déjà pris');
      return;
    }
    
    setLoading(true);

    try {
      console.log('🔄 Inscription en cours...');
      
      const result = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('✅ Réponse serveur:', result.data);
      
      if (result.data.success) {
        alert('🎉 Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        navigate('/connexion');
      } else {
        setError(result.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('❌ Erreur inscription:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
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
                Créer un compte
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
                  ></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom d'utilisateur *</label>
                  <input
                    type="text"
                    className={`form-control ${formData.username.length >= 3 && !usernameAvailable ? 'is-invalid' : ''}`}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="ex: john_doe"
                    minLength="3"
                  />
                  {formData.username.length >= 3 && (
                    <div className={`form-text ${!usernameAvailable ? 'text-danger' : 'text-success'}`}>
                      <i className={`bi ${usernameAvailable ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                      {usernameAvailable ? 'Nom disponible' : 'Nom déjà pris'}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email *</label>
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
                  <label className="form-label">Mot de passe *</label>
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
                  <div className="form-text">6 caractères minimum</div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Confirmer le mot de passe *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Retapez votre mot de passe"
                    minLength="6"
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
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Inscription...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        S'inscrire
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p className="mb-2">
                  Déjà un compte ?{' '}
                  <Link to="/connexion" className="text-warning fw-bold">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4 text-center">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="bi bi-arrow-left me-1"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
          
          <div className="alert alert-light border mt-4">
            <h6 className="alert-heading text-warning">
              <i className="bi bi-info-circle me-2"></i>
              Information
            </h6>
            <p className="mb-0 small">
              Tous les comptes créés ici sont des comptes utilisateurs standards.
              Les comptes administrateurs sont créés séparément.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;