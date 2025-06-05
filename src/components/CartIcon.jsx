import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/use-cart';
import CartPreview from './CartPreview';

const CartIcon = () => {
  const { cartCount } = useCart();
  const [isHovering, setIsHovering] = useState(false);
  const cartRef = useRef(null);

  // Close cart preview when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsHovering(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile) {
      // Toggle the cart preview on mobile
      setIsHovering(prev => !prev);
    } else {
      // On desktop, navigate to cart page on click
      window.location.href = '/carrito';
    }
  };

  const previewTimeout = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (previewTimeout.current) {
        clearTimeout(previewTimeout.current);
      }
    };
  }, []);

  // Toggle preview open/close
  const togglePreview = (open) => {
    if (previewTimeout.current) {
      clearTimeout(previewTimeout.current);
      previewTimeout.current = null;
    }
    
    if (open === false) {
      // Close immediately when mouse leaves
      setIsHovering(false);
    } else {
      setIsHovering(true);
    }
  };

  return (
    <div 
      className="relative inline-block" 
      ref={cartRef}
    >
      <div className="relative">
        <div 
          className="flex items-center cursor-pointer p-2 cart-icon-trigger"
          onMouseEnter={() => !window.matchMedia('(max-width: 1023px)').matches && togglePreview(true)}
          onClick={toggleCart}
          aria-label="Carrito"
        >
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white lg:text-gray-700 hover:text-blue-600 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            {cartCount && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Preview */}
      {isHovering && !window.matchMedia('(max-width: 1023px)').matches && (
        <div 
          className="absolute right-0 mt-2 cart-preview-container"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: 60 }}
        >
          <CartPreview />
        </div>
      )} 
      </div>
      
      {/* Mobile Preview */}
      {isHovering && window.matchMedia('(max-width: 1023px)').matches && (
        <div className="fixed inset-0 bg-black/30 lg:hidden flex items-start justify-end pt-20 pr-4">
          <div className="w-full max-w-xs" style={{ zIndex: 60 }}>
            <CartPreview onClose={() => setIsHovering(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
