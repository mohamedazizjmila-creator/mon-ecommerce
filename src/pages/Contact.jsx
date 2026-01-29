import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé ! (Fonctionnalité à connecter avec le backend)');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: 'bi-geo-alt', title: 'Adresse', info: '123 Rue du Commerce, 75000 Paris' },
    { icon: 'bi-telephone', title: 'Téléphone', info: '+33 1 23 45 67 89' },
    { icon: 'bi-envelope', title: 'Email', info: 'contact@e-shop.fr' },
    { icon: 'bi-clock', title: 'Horaires', info: 'Lun-Ven: 9h-18h' },
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Contactez-nous</h1>
      
      <div className="row">
        {/* Informations de contact */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="mb-4">Nos coordonnées</h3>
              {contactInfo.map((item, index) => (
                <div key={index} className="d-flex mb-4">
                  <div className="contact-icon me-3">
                    <i className={`bi ${item.icon} text-primary`} style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="mb-0 text-muted">{item.info}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <h5 className="mb-3">Suivez-nous</h5>
                <div className="d-flex gap-3">
                  {['bi-facebook', 'bi-twitter', 'bi-instagram', 'bi-linkedin'].map((icon) => (
                    <a key={icon} href="#" className="text-primary" style={{ fontSize: '1.5rem' }}>
                      <i className={`bi ${icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulaire de contact */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4">Envoyez-nous un message</h3>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Sujet *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-send me-2"></i>
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;