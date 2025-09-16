import React, { useState } from 'react';
import ContactModal from './ContactModal';

const StatusIndicator = ({ showInMobileMenu = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRadioClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed top-20 right-4 md:top-24 md:right-16 z-50">
        <div 
          className="flex items-center gap-2 bg-green-50 border-2 border-green-300 px-3 py-2 rounded-full shadow-lg cursor-pointer hover:bg-green-100 transition-colors"
          onClick={handleRadioClick}
        >
          <input 
            type="radio" 
            name="status" 
            className="w-4 h-4 text-green-600 bg-green-600 border-green-600 focus:ring-green-500 focus:ring-2 accent-green-600 cursor-pointer" 
            defaultChecked 
            readOnly
          />
          <span className="text-sm text-green-600 font-medium hidden md:inline">Disponible</span>
        </div>
      </div>
      
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default StatusIndicator;
