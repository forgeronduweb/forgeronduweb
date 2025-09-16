import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Contact() {
  const { isDark } = useTheme();
  return (
    <div 
      className="h-screen flex flex-col py-4 transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <h1 
        className="text-xl md:text-2xl font-semibold text-center mx-auto px-4 mb-2"
        style={{ color: isDark ? '#ffffff' : '#000000' }}
      >
        Contactez-moi
      </h1>
      <p 
        className="text-xs md:text-sm text-center max-w-lg mx-auto px-4 mb-4"
        style={{ color: isDark ? '#cccccc' : '#64748b' }}
      >
        Prêt à donner vie à votre projet ? Discutons de vos besoins et créons quelque chose d'exceptionnel ensemble.
      </p>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto w-full">
          {/* Contact Form */}
              <div 
                className="rounded-xl p-6 md:p-8"
                style={{
                  backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa'
                }}
              >      
                <form className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium mb-2"
                        style={{ color: isDark ? '#ffffff' : '#000000' }}
                      >
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg focus:ring-2 transition-all duration-200 text-sm md:text-base focus:outline-none hover:shadow-md"
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
                        htmlFor="email" 
                        className="block text-sm font-medium mb-2"
                        style={{ color: isDark ? '#ffffff' : '#000000' }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg focus:ring-2 transition-all duration-200 text-sm md:text-base focus:outline-none hover:shadow-md"
                        style={{
                          backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                          color: isDark ? '#ffffff' : '#000000',
                          border: isDark ? 'none' : '1px solid #e5e7eb'
                        }}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      htmlFor="subject" 
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? '#ffffff' : '#000000' }}
                    >
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg focus:ring-2 transition-all duration-200 text-sm md:text-base focus:outline-none hover:shadow-md"
                      style={{
                        backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000',
                        border: isDark ? 'none' : '1px solid #e5e7eb'
                      }}
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? '#ffffff' : '#000000' }}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg focus:ring-2 transition-all duration-200 resize-none text-sm focus:outline-none hover:shadow-md"
                      style={{
                        backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000',
                        border: isDark ? 'none' : '1px solid #e5e7eb'
                      }}
                      placeholder="Décrivez votre projet ou votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-6 rounded-lg font-medium focus:ring-2 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] border-2 text-sm hover:shadow-lg"
                    style={{
                      backgroundColor: isDark ? '#ffffff' : '#000000',
                      color: isDark ? '#000000' : '#ffffff',
                      borderColor: isDark ? '#ffffff' : '#000000'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDark ? '#e5e5e5' : '#374151';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDark ? '#ffffff' : '#000000';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
              
          {/* Social Media Icons */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <div className="flex justify-center space-x-6">
              <a 
                href="#" 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{ 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{ 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{ 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{ 
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  color: isDark ? '#ffffff' : '#000000'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};