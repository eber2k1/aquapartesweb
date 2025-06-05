import { useState, useEffect, useCallback, useContext } from 'react';
import { CartContext } from './cart-context';
import { NotificationContext } from '../../context/NotificationContext.jsx';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showNotification } = useContext(NotificationContext);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aquapartes-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('aquapartes-cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        // Usar setTimeout para asegurar que la notificación se muestre después de la actualización del estado
        setTimeout(() => {
          showNotification(`Se actualizó la cantidad de ${product.nombre} en el carrito`);
        }, 0);
        
        return updatedCart;
      }
      
      const newCart = [...prevCart, { ...product, quantity }];
      
      // Usar setTimeout para asegurar que la notificación se muestre después de la actualización del estado
      setTimeout(() => {
        showNotification(`${product.nombre} se agregó al carrito`);
      }, 0);
      
      return newCart;
    });
  }, [showNotification]);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate cart count by summing up quantities of all items
  const cartCount = cart.reduce((count, item) => count + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isInitialized
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
