import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const [showQR, setShowQR] = useState(false);
  const phoneNumber = '+51977607443';
  const whatsappUrl = `https://wa.me/51977607443`;
  
  // URL para generar QR code usando QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(whatsappUrl)}`;

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
            0% { 
              opacity: 0; 
              transform: translateY(20px) scale(0.9); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0px) scale(1); 
            }
          }
          
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          
          .whatsapp-float {
            animation: float 4s ease-in-out infinite;
          }
          
          .whatsapp-slideUp {
            animation: slideUp 0.5s ease-out;
          }
          
          .whatsapp-shine:hover .shine-effect {
            animation: shine 1.5s ease-in-out;
          }
        `}
      </style>
      
      <div className="fixed bottom-6 right-6 z-50">
        {/* QR Code Tooltip */}
        {showQR && (
          <div className="absolute bottom-20 right-0 mb-2 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-500 ease-out whatsapp-slideUp w-80">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full text-base font-semibold mb-6">
                📱 Escanea para chatear
              </div>
              <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-50">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code WhatsApp" 
                  className="w-44 h-44 mx-auto rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-base font-semibold text-gray-800">
                  {phoneNumber}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ¡Estamos listos para ayudarte con todos tus productos de tratamiento de agua!
                </p>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">En línea</span>
                </div>
              </div>
            </div>
            {/* Arrow pointing to button */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm"></div>
            </div>
          </div>
        )}
        
        {/* WhatsApp Button */}
        <div className="relative whatsapp-float">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 relative overflow-hidden whatsapp-shine"
            onMouseEnter={() => setShowQR(true)}
            onMouseLeave={() => setShowQR(false)}
            aria-label="Contactar por WhatsApp"
          >
            {/* Background pulse effect */}
            <div className="absolute inset-0 rounded-full bg-green-300 opacity-0 group-hover:opacity-30 animate-pulse"></div>
            
            {/* Icon */}
            <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform duration-300 relative z-10" />
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 group-hover:animate-ping"></div>
            
            {/* Shine effect */}
            <div className="shine-effect absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12"></div>
          </a>
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce">
            <div className="w-full h-full bg-red-400 rounded-full animate-ping absolute"></div>
          </div>
        </div>
      </div>
    </>
  );
}