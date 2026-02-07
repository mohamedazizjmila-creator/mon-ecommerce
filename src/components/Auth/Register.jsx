import React, { useState, useEffect } from 'react';
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  const navigate = useNavigate();

  // Vérifier si un admin est connecté
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await authService.checkAdminSession();
        if (response.data.adminConnected) {
          setAdminConnected(true);
          console.log('ℹ️ Admin connecté détecté:', response.data.adminUsername);
        }
      } catch (error) {
        console.log('Pas de session admin active');
      }
    };
    
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Effacer les erreurs quand l'utilisateur tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
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
    
    if (formData.username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return;
    }
    
    setLoading(true);

    try {
      console.log('🔄 Tentative d\'inscription...');
      
      // Utiliser l'inscription publique
      const result = await authService.registerPublic({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('📋 Réponse serveur:', result.data);
      
      if (result.data.success) {
        setSuccess('🎉 Compte créé avec succès ! Redirection vers la page de connexion...');
        
        // Réinitialiser le formulaire
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          navigate('/connexion');
        }, 2000);
      } else {
        setError(result.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('❌ Erreur détaillée:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError('Ce nom d\'utilisateur est déjà pris');
      } else if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez les informations saisies.');
      } else if (err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError('Erreur serveur. Code: ' + (err.response?.status || 'UNKNOWN'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Message d'information admin */}
          {adminConnected && (
            <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
              <i className="bi bi-shield-check me-2"></i>
              <strong>Mode admin:</strong> Un administrateur est connecté au backend.
              Votre inscription utilisera le mode public.
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setAdminConnected(false)}
              ></button>
            </div>
          )}
          
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
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>
                    Nom d'utilisateur *
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
                    disabled={loading}
                    autoComplete="username"
                  />
                  <div className="form-text">Entre 3 et 30 caractères</div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="exemple@email.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Mot de passe *
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
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <div className="form-text">Au moins 6 caractères</div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Répétez le mot de passe"
                    minLength="6"
                    disabled={loading}
                    autoComplete="new-password"
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
                        Création en cours...
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
                    En vous inscrivant, vous acceptez nos conditions d'utilisation et politique de confidentialité.
                  </p>
                </div>
              </form>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4">
              <div className="text-center">
                <Link to="/" className="text-decoration-none text-dark">
                  <i className="bi bi-arrow-left me-1"></i>
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
          
          {/* Conseils */}
          <div className="alert alert-light border mt-4" role="alert">
            <h6 className="alert-heading text-warning">
              <i className="bi bi-lightbulb me-2"></i>
              Conseils pour votre compte
            </h6>
            <ul className="mb-0 small">
              <li>Utilisez un mot de passe fort (majuscules, minuscules, chiffres)</li>
              <li>Gardez vos informations de connexion en sécurité</li>
              <li>Utilisez une adresse email valide pour récupérer votre compte</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;