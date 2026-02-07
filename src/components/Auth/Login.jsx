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
    setError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion...');
      
      // Utiliser authService
      const response = await authService.login(formData);
      
      console.log('📋 Réponse serveur:', response.data);
      
      if (response.data.success) {
        console.log('✅ Connexion réussie pour:', response.data.user?.username);
        
        // Rediriger immédiatement
        navigate('/');
      } else {
        setError(response.data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('❌ Erreur détaillée:', err);
      
      if (err.response?.status === 401) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message?.includes('Network Error')) {
        setError('Serveur non disponible. Vérifiez que le backend est démarré sur http://localhost:8080');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur interne. Veuillez réessayer plus tard.');
      } else {
        setError('Erreur de connexion. Code: ' + (err.response?.status || 'UNKNOWN'));
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
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={loading}
                    autoComplete="username"
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
                    placeholder="Entrez votre mot de passe"
                    disabled={loading}
                    autoComplete="current-password"
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
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Se connecter
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="mb-2">
                    Pas encore de compte ?{' '}
                    <Link to="/inscription" className="text-warning fw-bold text-decoration-none">
                      <i className="bi bi-person-plus me-1"></i>
                      S'inscrire
                    </Link>
                  </p>
                  <p className="small text-muted mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    Utilisez les identifiants de test: <code>test/test</code>
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
          
          {/* Instructions de test */}
          <div className="alert alert-light border mt-4" role="alert">
            <h6 className="alert-heading">
              <i className="bi bi-terminal text-warning me-2"></i>
              Pour tester dans la console
            </h6>
            <p className="mb-1 small">Ouvrez la console (F12) et tapez:</p>
            <code className="d-block bg-dark text-white p-2 rounded small">
              fetch('http://localhost:8080/api/auth/login', &#123;<br />
              &nbsp;&nbsp;method: 'POST',<br />
              &nbsp;&nbsp;headers: &#123;'Content-Type': 'application/json'&#125;,<br />
              &nbsp;&nbsp;body: JSON.stringify(&#123;username: 'test', password: 'test'&#125;)<br />
              &#125;).then(r =&gt; r.json()).then(console.log)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;