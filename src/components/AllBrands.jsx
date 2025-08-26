import { useNavigate } from 'react-router-dom';
import PageLoader from './PageLoader';

export default function AllBrands({ brands, loading, error, onViewProducts }) {
    const navigate = useNavigate();

    const handleBrandClick = (brandName) => {
        if (brandName) {
            navigate(`/marcas/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`);
        }
    };

    if (loading) {
        return <PageLoader message="Cargando marcas..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <section id="todas-las-marcas" className="py-12">
            <div className="container mx-auto px-4">
                <div itemScope itemType="https://schema.org/ItemList">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Todas Nuestras Marcas</h1>
                    <meta itemProp="name" content="Marcas Aliadas" />
                    <meta itemProp="description" content="Descubre nuestras marcas aliadas de confianza. Ofrecemos productos de las mejores marcas en el mercado." />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {brands.map((brand, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer h-full"
                                onClick={() => handleBrandClick(brand.marca)}
                            >
                                <div className="p-4 flex flex-col items-center h-full">
                                    <div className="flex flex-col items-center flex-grow w-full">
                                        {brand.marca_imagen ? (
                                            <div itemProp="item" itemScope itemType="https://schema.org/Thing" className="flex-shrink-0">
                                                <img 
                                                    src={brand.marca_imagen} 
                                                    alt={`Logotipo de ${brand.marca}`}
                                                    className="h-20 w-auto object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-brand.png';
                                                    }}
                                                />
                                                <meta itemProp="name" content={brand.marca} />
                                            </div>
                                        ) : (
                                            <div className="h-20 flex items-center justify-center w-full bg-gray-50 rounded flex-shrink-0">
                                                <span className="text-gray-400 text-sm">{brand.marca}</span>
                                            </div>
                                        )}
                                        <h2 className="text-lg font-medium text-gray-900 mt-3 text-center">
                                            {brand.marca}
                                        </h2>
                                        
                                        {/* Categories - Usando el array 'categories' procesado en Brands.jsx */}
                                        {brand.categories && brand.categories.length > 0 && (
                                            <div className="mt-2 w-full flex-grow">
                                                <div className="flex flex-wrap gap-1.5 justify-center">
                                                    {brand.categories
                                                        .filter(cat => cat && cat.trim() !== '')
                                                        .slice(0, 3)
                                                        .map((categoria, idx) => (
                                                            <span 
                                                                key={idx}
                                                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onViewProducts(brand.marca, categoria);
                                                                }}
                                                                title={`Ver productos de ${categoria}`}
                                                            >
                                                                {categoria}
                                                            </span>
                                                        ))
                                                    }
                                                    {brand.categories.filter(cat => cat && cat.trim() !== '').length > 3 && (
                                                        <span className="text-xs text-gray-400 self-center">
                                                            +{brand.categories.filter(cat => cat && cat.trim() !== '').length - 3} más
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewProducts(brand.marca); // Usando el alias 'marca'
                                        }}
                                        className="mt-4 w-full bg-sky-800 text-white py-1.5 px-3 rounded hover:bg-sky-400 transition-colors text-sm font-medium whitespace-nowrap"
                                    >
                                        Ver Productos
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
