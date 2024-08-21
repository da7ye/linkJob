import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  // Handle clicks on the overlay
  const handleOverlayClick = (event) => {
    // Close the modal only if the click is on the overlay (not on the modal content)
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
      onClick={handleOverlayClick} // Click handler for overlay
    >
      <div className="relative max-w-3xl mx-auto p-4 bg-white rounded-lg">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <img 
          src={imageUrl} 
          alt="Full-size view" 
          className="w-full h-auto max-h-screen object-contain" 
        />
      </div>
    </div>
  );
};

export default ImageModal;
