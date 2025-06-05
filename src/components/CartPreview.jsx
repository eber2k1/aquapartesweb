import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/use-cart';
import { useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const CartPreview = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const previewRef = useRef();

  // Close preview when clicking outside - only for mobile
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    
    const handleClickOutside = (event) => {
      // Don't close if clicking inside the preview or on cart icon
      if (previewRef.current?.contains(event.target)) return;
      
      const cartIcon = document.querySelector('[aria-label="Carrito"]');
      if (cartIcon?.contains(event.target)) return;
      
      onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!cart || cart.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
        <p className="text-gray-600 text-center py-4">Tu carrito está vacío</p>
      </div>
    );
  }

  // Use different classes based on screen size
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  
  return (
    <div 
      ref={previewRef}
      className={`${isMobile ? 'fixed right-4 top-20 w-full max-w-xs' : 'absolute right-0 mt-2 w-80'} bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden`}
      style={{
        maxHeight: isMobile ? 'calc(100vh - 7rem)' : '70vh',
        overflowY: 'auto',
      }}
      onMouseLeave={() => !isMobile && onClose?.()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tu Carrito</h3>
          {isMobile && (
            <button 
              onClick={() => onClose?.()}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar carrito"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div key={item.id} className="py-3 flex items-center">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3 className="text-sm line-clamp-1">{item.nombre}</h3>
                </div>
                <div className="flex items-center mt-1 bg-gray-50 rounded-md p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="text-gray-500 hover:text-gray-700 px-2"
                  >
                    -
                  </button>
                  <span className="mx-2 font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    className="text-gray-500 hover:text-gray-700 px-2"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromCart(item.id);
                }}
                className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Eliminar producto"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
        <a
          href={`https://wa.me/51977607443?text=${encodeURIComponent(
            `Hola, estoy interesado en los siguientes productos:\n\n${cart.map(item => 
              `- ${item.nombre} (Cantidad: ${item.quantity})`
            ).join('\n')}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={(e) => e.stopPropagation()}
        >
          <FaWhatsapp className="text-lg" />
          Consultar por WhatsApp
        </a>
        <Link
          to="/carrito"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => onClose?.()}
        >
          Ver carrito completo
        </Link>
      </div>
    </div>
  );
};

export default CartPreview;
