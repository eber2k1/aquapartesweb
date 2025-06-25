import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/use-cart';

export const ProductList = ({ products, error, onAddToCart }) => {
    const { addToCart } = useCart();

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <Link 
                        to={`/productos/${product.nombre?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                        state={{ productId: product.id }}
                        className="flex flex-col h-full"
                    >
                        <div className="px-4 pt-4">
                            {product.marca_nombre && (
                                <p className="inline-block text-xs font-semibold uppercase tracking-wider rounded bg-sky-50 px-2 py-1 text-sky-600 mb-2">
                                    {product.marca_nombre}
                                </p>
                            )}
                        </div>
                        <div className="relative h-48 flex items-center justify-center p-4">
                            <img 
                                src={product.imagen || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGw6I2YyZjJmMjtmaWxsLW9wYWNpdHk6MC4xOyIvPjwvc3ZnPg=='} 
                                alt={`${product.nombre}${product.marca_nombre ? ` de ${product.marca_nombre}` : ''}`}
                                className="max-h-full max-w-full object-contain"
                                width="300"
                                height="300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGw6I2YyZjJmMjtmaWxsLW9wYWNpdHk6MC4xOyIvPjwvc3ZnPg==';
                                }}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className="p-4 flex-grow">
                            <h3 className="font-semibold text-lg group-hover:text-sky-600 transition-colors">
                                {product.nombre || 'Producto sin nombre'}
                            </h3>
                        </div>
                    </Link>
                    <div className="p-4 pt-0">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToCart ? onAddToCart(product) : addToCart(product);
                            }}
                            className="w-full py-2 px-4 rounded-md bg-sky-50 hover:bg-sky-950 text-sky-500 font-medium transition-colors"
                        >
                            Agregar producto
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
