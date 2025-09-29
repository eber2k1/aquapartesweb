import { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isChromeIOS = /CriOS/.test(navigator.userAgent);
    
    setIsIOS(isIOSDevice);
    setIsIOSChrome(isIOSDevice && isChromeIOS);

    // Para iOS, mostrar el botón si no está ya instalado
    if (isIOSDevice) {
      const isInStandaloneMode = window.navigator.standalone;
      if (!isInStandaloneMode) {
        setShowInstallButton(true);
      }
      return;
    }

    // Para Android/Chrome (código existente)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA fue instalada');
      setShowInstallButton(false);
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
    if (isIOSChrome) {
      // Mostrar instrucciones específicas para Chrome en iOS
      setShowIOSInstructions(true);
      return;
    }

    if (isIOS) {
      // Instrucciones para Safari en iOS
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

  if (!showInstallButton) return null;

  return (
    <>
      <button onClick={handleInstallClick} className="fixed bottom-4 left-4 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors duration-200 z-50" title="Instalar AquaPartes como aplicación">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isIOS ? 'Agregar a Inicio' : 'Instalar AquaPartes'}
      </button>

      {/* Modal con instrucciones específicas */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Instalar AquaPartes</h3>
            
            {isIOSChrome ? (
              // Instrucciones para Chrome en iOS
              <div className="space-y-3 text-sm">
                <p className="text-orange-600 font-medium">⚠️ Estás usando Chrome en iOS</p>
                <div className="space-y-2">
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
              // Instrucciones para Safari en iOS
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
              className="mt-4 w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors"
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