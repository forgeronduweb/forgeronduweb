import React from 'react';

const StatusIndicator = ({ showInMobileMenu = false }) => {
  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
      <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 px-3 py-2 rounded-full shadow-lg">
        <input 
          type="radio" 
          name="status" 
          className="w-4 h-4 text-green-600 bg-green-600 border-green-600 focus:ring-green-500 focus:ring-2 accent-green-600" 
          defaultChecked 
        />
        <span className="text-sm text-green-600 font-medium hidden md:inline">Disponible</span>
      </div>
    </div>
  );
};

export default StatusIndicator;
