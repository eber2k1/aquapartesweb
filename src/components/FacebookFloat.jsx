import { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';

export default function FacebookFloat() {
  const [showPreview, setShowPreview] = useState(false);
  const facebookPageUrl = 'https://www.facebook.com/Aquapartessac';

  // Facebook Page Plugin (iframe)
  const pluginUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    facebookPageUrl
  )}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <>
      {/* Estilos CSS globales */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-8px) rotate(1deg); }
            50% { transform: translateY(-12px) rotate(0deg); }
            75% { transform: translateY(-8px) rotate(-1deg); }
          }
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(20px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0px) scale(1); }
          }
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          .facebook-float { animation: float 4s ease-in-out infinite; }
          .facebook-slideUp { animation: slideUp 0.5s ease-out; }
        `}
      </style>

      {/* Controla el hover en el contenedor padre para incluir botón y tooltip */}
      <div
        className="fixed bottom-24 right-6 z-50"
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {/* Tooltip con vista previa interactiva */}
        {showPreview && (
          <div
            className="absolute bottom-20 right-0 mb-2 bg-white rounded-2xl shadow-2xl p-2 border border-gray-100 transform transition-all duration-500 ease-out facebook-slideUp w-[360px] pointer-events-auto"
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
          >
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              <iframe
                title="Vista previa Facebook"
                src={pluginUrl}
                width="340"
                height="500"
                style={{ border: 'none', overflow: 'hidden', width: '340px', height: '500px', backgroundColor: 'transparent', pointerEvents: 'auto' }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media"
              />
            </div>
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm"></div>
            </div>
          </div>
        )}

        {/* Botón flotante de Facebook (sin onMouseEnter/Leave aquí) */}
        <div className="relative facebook-float">
          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 relative overflow-hidden"
            aria-label="Abrir página de Facebook"
          >
            <div className="absolute inset-0 rounded-full bg-blue-300 opacity-0 group-hover:opacity-30 animate-pulse"></div>
            <FaFacebook className="text-white text-3xl group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 group-hover:animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12"></div>
          </a>
        </div>
      </div>
    </>
  );
}