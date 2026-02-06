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
  const [step, setStep] = useState(1); // 1: Formulaire, 2: Vérification OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [adminConnected, setAdminConnected] = useState(false);
  const navigate = useNavigate();

  // Vérifier si un admin est connecté
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await authService.checkAdminSession();
        if (response.data.adminConnected) {
          setAdminConnected(true);
          console.log('ℹ️ Un admin est déjà connecté au backend');
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
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus sur le champ suivant
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
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
    
    setLoading(true);

    try {
      console.log('🔄 Début de l\'inscription...');
      
      // Afficher info si admin connecté
      if (adminConnected) {
        console.log('📢 Utilisation de l\'inscription publique (admin connecté)');
      }
      
      // Utiliser l'inscription PUBLIQUE
      const result = await authService.registerPublic({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('📋 Réponse du serveur:', result.data);
      
      if (result.data.success) {
        if (result.data.requiresVerification) {
          // Passer à l'étape de vérification
          setVerificationEmail(result.data.email);
          setStep(2);
          setSuccess('Code de vérification généré. Veuillez vérifier vos emails.');
        } else {
          // Rediriger directement vers le login
          alert('🎉 Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          navigate('/connexion');
        }
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
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError('Erreur: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.verifyEmail({
        email: verificationEmail,
        otp: otpCode
      });

      if (result.data.success) {
        setSuccess('✅ Email vérifié avec succès !');
        
        // Attendre 2 secondes puis rediriger
        setTimeout(() => {
          navigate('/connexion', { 
            state: { message: 'Votre compte a été activé avec succès !' } 
          });
        }, 2000);
      } else {
        setError(result.data.message || 'Code invalide');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.sendVerificationEmail(verificationEmail);
      
      if (result.data.success) {
        setSuccess('📧 Nouveau code envoyé !');
        setOtp(['', '', '', '', '', '']); // Réinitialiser les champs OTP
      } else {
        setError(result.data.message || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérification OTP
  if (step === 2) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-header bg-white border-0 pt-4">
                <h3 className="text-center mb-0 text-warning">
                  <i className="bi bi-shield-check me-2"></i>
                  Vérification Email
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
                
                <div className="text-center mb-4">
                  <p className="mb-1">Un code à 6 chiffres a été envoyé à :</p>
                  <p className="fw-bold">{verificationEmail}</p>
                  <p className="text-muted small">
                    Entrez le code ci-dessous pour activer votre compte
                  </p>
                </div>
                
                {/* Champs OTP */}
                <div className="mb-4">
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="form-control text-center"
                        style={{ width: '50px', height: '60px', fontSize: '24px' }}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="button" 
                    className="btn btn-warning btn-lg"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Vérification...
                      </>
                    ) : (
                      'Vérifier le code'
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-link text-decoration-none"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Renvoyer le code
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                className="btn btn-outline-dark"
                onClick={() => setStep(1)}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Retour à l'inscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Étape 1 : Formulaire d'inscription
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Message d'information */}
          {adminConnected && (
            <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Information:</strong> Un administrateur est actuellement connecté au système.
              Votre inscription n'affectera pas sa session.
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setAdminConnected(false)}
                aria-label="Fermer"
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
                    placeholder="Répétez le mot de passe"
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
          
          {/* Conseils */}
          <div className="alert alert-light border mt-4" role="alert">
            <h6 className="alert-heading">
              <i className="bi bi-lightbulb text-warning me-2"></i>
              Conseils pour votre compte
            </h6>
            <ul className="mb-0 small">
              <li>Choisissez un nom d'utilisateur facile à retenir</li>
              <li>Utilisez un mot de passe fort avec chiffres et lettres</li>
              <li>Gardez vos informations de connexion en sécurité</li>
              <li>Vous recevrez un code de vérification par email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;