import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ContactModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: 'Message via contact rapide'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Message envoyé avec succès !' });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Erreur lors de l\'envoi du message.' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Erreur de connexion au serveur.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl transform transition-all"
        style={{
          backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-xl font-semibold"
            style={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            Contact rapide
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status Message */}
        {submitStatus && (
          <div 
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="modal-name" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#ffffff' : '#000000' }}
            >
              Nom *
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg focus:ring-2 transition-colors text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                border: isDark ? 'none' : '1px solid #e5e7eb'
              }}
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label 
              htmlFor="modal-email" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#ffffff' : '#000000' }}
            >
              Email *
            </label>
            <input
              type="email"
              id="modal-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-lg focus:ring-2 transition-colors text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                border: isDark ? 'none' : '1px solid #e5e7eb'
              }}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label 
              htmlFor="modal-message" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#ffffff' : '#000000' }}
            >
              Message *
            </label>
            <textarea
              id="modal-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 transition-colors resize-none text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                border: isDark ? 'none' : '1px solid #e5e7eb'
              }}
              placeholder="Votre message..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors border-2 text-sm"
              style={{
                backgroundColor: 'transparent',
                color: isDark ? '#ffffff' : '#000000',
                borderColor: isDark ? '#555555' : '#d1d5db'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors border-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                borderColor: isDark ? '#ffffff' : '#000000'
              }}
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
