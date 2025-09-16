import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ContactModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique d'envoi du formulaire
    console.log('Formulaire soumis');
    onClose();
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
              required
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-colors text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                borderColor: isDark ? '#555555' : '#d1d5db'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDark ? '#ffffff' : '#000000';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#555555' : '#d1d5db';
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
              required
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-colors text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                borderColor: isDark ? '#555555' : '#d1d5db'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDark ? '#ffffff' : '#000000';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#555555' : '#d1d5db';
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
              required
              rows={3}
              className="w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-colors resize-none text-sm focus:outline-none"
              style={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
                borderColor: isDark ? '#555555' : '#d1d5db'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDark ? '#ffffff' : '#000000';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#555555' : '#d1d5db';
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
              className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors border-2 text-sm"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                borderColor: isDark ? '#ffffff' : '#000000'
              }}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
