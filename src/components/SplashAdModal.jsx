import { useEffect, useState, useRef } from 'react';

export const SplashAdModal = ({
  isOpen,
  onClose,
  images,
  imageSrc = '/SplashModal01.jpg',
  intervalMs = 10000, // 10 segundos por defecto
  closeOnOverlay = true,
  autoRotate = true
}) => {
  const defaultImages = [
    '/adds/oferta01.jpeg',
    '/adds/oferta02.jpeg',
    '/adds/oferta03.jpeg'
  ];
  const effectiveImages =
    Array.isArray(images) && images.length > 0
      ? images
      : imageSrc
        ? [imageSrc]
        : defaultImages;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cycleStart = useRef(Date.now());
  const rafId = useRef(null);
  // Nuevo: estado de pausa
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsFading(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
          setIsFading(false);
          cycleStart.current = Date.now();
          setProgress(0);
        }, 300);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsFading(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
          setIsFading(false);
          cycleStart.current = Date.now();
          setProgress(0);
        }, 300);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, effectiveImages.length]);

  // Rotación automática con fade, respetando pausa del usuario
  useEffect(() => {
    if (!isOpen || !autoRotate || isPaused || effectiveImages.length <= 1 || intervalMs <= 0) return;

    let fadeTimeout = null;

    const timer = setInterval(() => {
      setIsFading(true);
      fadeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
        setIsFading(false);
        cycleStart.current = Date.now();
        setProgress(0);
      }, 300);
    }, intervalMs);

    return () => {
      clearInterval(timer);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [isOpen, autoRotate, isPaused, intervalMs, effectiveImages.length]);

  // Animación del progreso (0 → 1) para calcular segundos restantes, respetando pausa
  useEffect(() => {
    if (!isOpen || !autoRotate || isPaused || effectiveImages.length <= 1 || intervalMs <= 0) return;

    cycleStart.current = Date.now();
    setProgress(0);

    const step = () => {
      const elapsed = Date.now() - cycleStart.current;
      const p = Math.min(1, elapsed / intervalMs);
      setProgress(p);
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [isOpen, autoRotate, isPaused, intervalMs, currentIndex, effectiveImages.length]);

  // Reinicia ciclo cuando se reanuda
  useEffect(() => {
    if (isOpen && autoRotate && !isPaused && intervalMs > 0) {
      cycleStart.current = Date.now();
      setProgress(0);
    }
  }, [isPaused, isOpen, autoRotate, intervalMs]);

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
    objectFit: 'contain',
    transition: 'opacity 300ms ease-in-out',
    opacity: isFading ? 0 : 1
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

  // Cálculo de segundos restantes (centralizado)
  const remainingSeconds = Math.max(0, Math.ceil((intervalMs * (1 - progress)) / 1000));

  // Controles manuales
  const handlePrev = (e) => {
    e?.stopPropagation?.();
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
      setIsFading(false);
      cycleStart.current = Date.now();
      setProgress(0);
    }, 300);
  };
  const handleNext = (e) => {
    e?.stopPropagation?.();
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
      setIsFading(false);
      cycleStart.current = Date.now();
      setProgress(0);
    }, 300);
  };
  const togglePause = (e) => {
    e?.stopPropagation?.();
    setIsPaused((p) => !p);
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} aria-modal="true" role="dialog">
      <div style={modalStyle}>
        {/* Botón cerrar */}
        <button type="button" style={closeBtnStyle} onClick={onClose} aria-label="Cerrar anuncio">
          Cerrar
        </button>

        {/* Imagen actual */}
        <img
          src={effectiveImages[currentIndex]}
          alt="Anuncio AquaPartes"
          style={imgStyle}
        />

        {/* Indicador superior con segundos y play/pausa */}
        {autoRotate && effectiveImages.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '9999px'
          }}>
            <span style={{ fontSize: '12px', lineHeight: 1 }}>
              {isPaused ? 'Pausado' : `${remainingSeconds}s`}
            </span>
            <button
              type="button"
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              onClick={togglePause}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '0 4px'
              }}
            >
              {isPaused ? '▶' : '❚❚'}
            </button>
          </div>
        )}

        {/* Controles laterales: anterior (izquierda) y siguiente (derecha) */}
        {effectiveImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '8px 10px',
                borderRadius: '6px'
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '8px 10px',
                borderRadius: '6px'
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}