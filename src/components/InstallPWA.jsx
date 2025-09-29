import { useState, useEffect } from 'react';

const InstallPWA = ({ inline = false, mobile = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showInstalledMessage, setShowInstalledMessage] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isChromeIOS = /CriOS/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone;
    
    setIsIOS(isIOSDevice);
    setIsIOSChrome(isIOSDevice && isChromeIOS);

    // Para iOS, verificar si está instalado
    if (isIOSDevice) {
      if (isInStandaloneMode) {
        setShowInstalledMessage(true);
      } else {
        setShowInstallButton(true);
      }
      return;
    }

    // Para Android/Chrome - verificar si está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setShowInstalledMessage(true);
      return;
    }

    // Si no está instalado, mostrar botón (para Android/Chrome)
    setShowInstallButton(true);

    // Listener para el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listener para cuando se instala la app
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setShowInstalledMessage(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Para debug: siempre mostrar en mobile menu si mobile=true
  const shouldShowButton = mobile ? true : showInstallButton;

  return (
    <>
      {/* Botón de instalación */}
      {shouldShowButton && (
        <button 
          onClick={handleInstallClick} 
          className={
            mobile 
              ? "w-full flex items-center px-4 py-3 text-white bg-cyan-400/20 hover:bg-cyan-400/30 hover:text-white font-medium transition-all duration-200 rounded-lg border-l-4 border-cyan-400 gap-3"
              : inline 
                ? "px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-white font-medium text-sm tracking-wide transition-all duration-200 rounded-lg flex items-center gap-2 shadow-md" 
                : "fixed bottom-4 left-4 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors duration-200 z-50"
          }
          title="Instalar AquaPartes como aplicación"
        >
          <svg className={mobile ? "w-5 h-5" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {mobile 
            ? (isIOS ? 'Agregar a Inicio' : 'Instalar AquaPartes')
            : inline 
              ? (isIOS ? 'Agregar' : 'Instalar') 
              : (isIOS ? 'Agregar a Inicio' : 'Instalar AquaPartes')
          }
        </button>
      )}

      {/* Mensaje discreto cuando está instalado - solo para versión flotante */}
      {showInstalledMessage && !inline && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>AquaPartes instalado</span>
          <button
            onClick={() => setShowInstalledMessage(false)}
            className="ml-2 text-green-200 hover:text-white transition-colors"
            title="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Modal con instrucciones específicas */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-0">
          <div className="bg-white rounded-t-xl p-6 max-w-sm mx-auto w-full animate-slide-up">
            <h3 className="text-lg font-semibold mb-4 text-center">Instalar AquaPartes</h3>
            
            {isIOSChrome ? (
              <div className="space-y-3 text-sm">
                <p className="text-orange-600 font-medium text-center">⚠️ Estás usando Chrome en iOS</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <span>Abre esta página en <strong>Safari</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <span>Toca "Compartir" en Safari</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <span>Selecciona "Agregar a pantalla de inicio"</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <span>Toca el botón "Compartir" en Safari</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">➕</span>
                  <span>Selecciona "Agregar a pantalla de inicio"</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span>Confirma tocando "Agregar"</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;