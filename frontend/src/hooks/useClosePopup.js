import { useEffect } from 'react';

function useClosePopup(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const handleCloseByOverlay = (evt) => {
      if (evt.target.classList.contains('popup')) {
        onClose();
      }
    };

    const handleEscClose = (evt) => {
      if (evt.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('mousedown', handleCloseByOverlay)

    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('mousedown', handleCloseByOverlay);
    }
  }, [isOpen])
}

export default  useClosePopup;