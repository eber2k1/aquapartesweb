import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const InstallModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldInstall = searchParams.get('install') === 'true';
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar dispositivo y modo
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isChromeIOS = /CriOS/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    setIsIOS(isIOSDevice);
    setIsIOSChrome(isIOSDevice && isChromeIOS);
    setIsStandalone(isInStandaloneMode);

    // Listener para beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('install');
    setSearchParams(newParams);
  };

  // Si no está activado por URL o ya está instalada, no mostrar nada
  if (!shouldInstall || isStandalone) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="bg-white rounded-2xl p-6 max-w-[90%] w-[400px] shadow-2xl text-center relative mx-4 animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 flex justify-center">
          <img src="/logov8.png" alt="AquaPartes" className="h-16 object-contain" />
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900">
          Instalar AquaPartes
        </h2>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed px-2">
          Instala nuestra aplicación para una experiencia más rápida y acceso directo desde tu pantalla de inicio.
        </p>

        {isIOS ? (
          <div className="text-left bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
            <p className="font-semibold mb-3 text-gray-700 text-sm">Para instalar en iOS:</p>
            <div className="flex items-center gap-3 mb-3 text-gray-600 text-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-xs text-cyan-600 shadow-sm">1</span>
              <span>Toca el botón <strong>Compartir</strong> <span className="text-lg align-middle">⎋</span></span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 font-bold text-xs text-cyan-600 shadow-sm">2</span>
              <span>Selecciona <strong>Agregar a Inicio</strong> <span className="text-lg align-middle">➕</span></span>
            </div>
            {isIOSChrome && (
              <p className="mt-3 text-orange-600 text-xs font-medium bg-orange-50 p-2 rounded flex items-start gap-2">
                <span>⚠️</span> Recomendamos usar Safari para la mejor experiencia.
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={handleInstall}
            disabled={!deferredPrompt}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
              deferredPrompt 
                ? 'bg-cyan-500 hover:bg-cyan-600 hover:shadow-cyan-500/30 hover:-translate-y-0.5' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {deferredPrompt ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instalar Ahora
              </>
            ) : (
              'Cargando...'
            )}
          </button>
        )}

        {!isIOS && !deferredPrompt && (
          <p className="text-xs text-gray-400 mt-4 px-4 text-center">
            Si el botón no se activa, usa la opción "Instalar aplicación" del menú de tu navegador.
          </p>
        )}
      </div>
    </div>
  );
};
