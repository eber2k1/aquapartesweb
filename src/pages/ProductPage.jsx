import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { productsApi } from '../services/api';
import ProductImageZoom from '../components/ProductImageZoom';

export const ProductPage = () => {
    const { id: slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get the product ID from the route state or from the slug if not available
    const id = location.state?.productId || slug;


    const [activeTab, setActiveTab] = useState('descripcion');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Use the API service to fetch the product
                const data = await productsApi.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message || 'Error al cargar el producto. Por favor, intente de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4">
                    <Link 
                        to="/productos" 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Volver a Productos
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-4">Lo sentimos, no pudimos encontrar el producto solicitado.</p>
                    <Link 
                        to="/productos" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        ← Volver a Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/" className="text-blue-600 hover:text-blue-800">INICIO</Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link to="/productos" className="text-blue-600 hover:text-blue-800">PRODUCTOS</Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-600">{product.nombre}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image */}
                        <div className="md:w-1/2 p-6">
                            <ProductImageZoom 
                                imageUrl={product.imagen}
                                alt={product.nombre}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-6">
                            <div className="border-b pb-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
                                        {product.serie && (
                                            <p className="text-gray-600 mb-2">Serie: {product.serie}</p>
                                        )}
                                        {product.marca && (
                                            <p className="text-gray-600 mb-4">Marca: <span className="uppercase">{product.marca}</span></p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* WhatsApp Button */}
                                <div className="mt-6">
                                    <a 
                                        href={`https://wa.me/51923476522?text=Hola, estoy interesado en el producto: ${encodeURIComponent(product.nombre)} (${window.location.href})`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors w-full sm:w-auto"
                                    >
                                        <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.784-1.66-2.087-.173-.297-.018-.458.132-.606.136-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.508-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.492.709.306 1.262.489 1.694.625.712.227 1.361.195 1.871.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.345m-6.858 7.443h-.016a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.723 1.467h.005c6.554 0 11.89-5.335 11.89-11.893 0-3.176-1.24-6.165-3.495-8.411"/>
                                        </svg>
                                        Consultar por WhatsApp
                                    </a>
                                </div>
                                
                                {/* Categoría y Subcategoría */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {product.categoria && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {product.categoria}
                                        </span>
                                    )}
                                    {product.subcategoria && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {product.subcategoria}
                                        </span>
                                    )}
                                </div>
                            </div>
                    
                            {/* Palabras Clave */}
                            {product.palabras_clave && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {product.palabras_clave.split(',').map((keyword, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                            >
                                                {keyword.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Ficha Técnica */}
                            {product.ficha_tecnica_url && (
                                <div className="mt-6">
                                    <a 
                                        href={product.ficha_tecnica_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Descargar Ficha Técnica
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                

                {/* Description and Specifications Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
                    <div className="p-6">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('descripcion')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'descripcion'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Descripción
                                </button>
                                <button
                                    onClick={() => setActiveTab('especificaciones')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'especificaciones'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Especificaciones Técnicas
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="py-6">
                            {activeTab === 'descripcion' && product.descripcion && (
                                <div className="w-full">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-medium text-gray-900 mb-2">Descripción del Producto</h3>
                                        <div className="h-1 w-16 bg-blue-700"></div>
                                    </div>
                                    <div className="prose max-w-none">
                                        <div 
                                            className="description-content"
                                            dangerouslySetInnerHTML={{ __html: product.descripcion }}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'especificaciones' && product.especificaciones && (
                                <div className="w-full">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-medium text-gray-900 mb-2">Especificaciones Técnicas</h3>
                                        <div className="h-1 w-16 bg-blue-700"></div>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div 
                                            className="specs-content"
                                            dangerouslySetInnerHTML={{ __html: product.especificaciones }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a Productos
                    </button>
                </div>
            </div>
        </div>
    );
};