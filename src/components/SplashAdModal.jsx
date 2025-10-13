import { useEffect } from 'react';

export const SplashAdModal = ({ isOpen, onClose, imageSrc = '/SplashModal01.jpg', closeOnOverlay = true }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const modalStyle = {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#000'
  };

  const imgStyle = {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '90vh',
    objectFit: 'contain'
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    border: 'none',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '8px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const handleOverlayClick = (e) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} aria-modal="true" role="dialog">
      <div style={modalStyle}>
        <button type="button" style={closeBtnStyle} onClick={onClose} aria-label="Cerrar anuncio">
          Cerrar
        </button>
        <img src={imageSrc} alt="Anuncio AquaPartes" style={imgStyle} />
      </div>
    </div>
  );
};