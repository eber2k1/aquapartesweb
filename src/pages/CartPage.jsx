import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/use-cart';
import { FaWhatsapp } from 'react-icons/fa';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">Agrega productos a tu carrito para continuar</p>
        <Link 
          to="/productos" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        <button 
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cart.map(item => (
            <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                {item.imagen && (
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 px-4">
                <h3 className="text-sm font-medium text-gray-900">{item.nombre}</h3>
              </div>

              <div className="mt-4 md:mt-0 flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Total de productos: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/51977607443?text=${encodeURIComponent(
                  `Hola, estoy interesado en los siguientes productos:\n\n${cart.map(item => 
                    `- ${item.nombre} (Cantidad: ${item.quantity})`
                  ).join('\n')}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp className="text-lg" />
                Consultar por WhatsApp
              </a>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
