import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brandsApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';
import PageLoader from '../components/PageLoader';

export const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';

    const { updateFilters } = useFilters();
    
    // Update document head with meta tags
    useEffect(() => {
        // Set page title
        const pageTitle = 'Marcas Aliadas | AquaPartes';
        document.title = pageTitle;
        
        // Meta description
        const description = 'Descubre nuestras marcas aliadas de confianza. Ofrecemos productos de las mejores marcas en el mercado.';
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
        
        // Canonical URL
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.rel = 'canonical';
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.href = currentUrl;
        
        // Open Graph / Facebook
        const ogTags = {
            'og:title': pageTitle,
            'og:description': description,
            'og:url': currentUrl,
            'og:type': 'website',
            'og:site_name': 'AquaPartes'
        };
        
        // Twitter Card
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': pageTitle,
            'twitter:description': description
        };
        
        // Update or create meta tags
        const updateMetaTag = (name, content, property = null) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let tag = document.querySelector(selector);
            
            if (!tag) {
                tag = document.createElement('meta');
                if (property) {
                    tag.setAttribute('property', name);
                } else {
                    tag.name = name;
                }
                document.head.appendChild(tag);
            }
            tag.content = content;
        };
        
        // Set all meta tags
        Object.entries(ogTags).forEach(([key, value]) => updateMetaTag(key, value, true));
        Object.entries(twitterTags).forEach(([key, value]) => updateMetaTag(key, value));
        
        // Cleanup function
        return () => {
            document.title = 'AquaPartes';
        };
    }, [currentUrl]);
    
    // Add structured data for brands
    useEffect(() => {
        if (!brands || brands.length === 0) return;
        
        const scriptId = 'brands-structured-data';
        let script = document.getElementById(scriptId);
        
        if (script) {
            script.remove();
        }
        
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': brands.map((brand, index) => ({
                '@type': 'Brand',
                'position': index + 1,
                'name': brand.marca,
                'description': `Productos de la marca ${brand.marca} disponibles en AquaPartes`,
                'url': `${window.location.origin}/productos?marca=${encodeURIComponent(brand.marca)}`,
                'logo': brand.marca_imagen || 'https://via.placeholder.com/150'
            }))
        });
        
        document.head.appendChild(script);
        
        return () => {
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, [brands]);

    const handleViewProducts = (brandName) => {
        // Actualizar el estado global con la marca seleccionada
        updateFilters({ 
            brands: [brandName],
            categories: [],
            subcategories: []
        });
        // Navegar a la página de productos
        navigate('/productos');
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandsApi.getBrands();
                // Ordenar alfabéticamente por el campo 'marca'
                // Agrupar marcas por nombre y combinar categorías
                const groupedBrands = data.reduce((acc, brand) => {
                    const existingBrand = acc.find(b => 
                        b.marca.toLowerCase() === brand.marca.toLowerCase()
                    );
                    
                    if (existingBrand) {
                        // Si la categoría no está ya incluida, la añadimos
                        if (brand.categoria && !existingBrand.categorias?.includes(brand.categoria)) {
                            existingBrand.categorias = [...(existingBrand.categorias || []), brand.categoria];
                        }
                        // Mantener la primera imagen que encontremos
                        if (!existingBrand.marca_imagen && brand.marca_imagen) {
                            existingBrand.marca_imagen = brand.marca_imagen;
                        }
                        return acc;
                    }
                    
                    // Si es una marca nueva, la añadimos con un array de categorías
                    return [...acc, {
                        ...brand,
                        categorias: brand.categoria ? [brand.categoria] : []
                    }];
                }, []);
                
                // Ordenar alfabéticamente
                const sortedBrands = [...groupedBrands].sort((a, b) => 
                    a.marca.localeCompare(b.marca, 'es', {sensitivity: 'base'})
                );
                setBrands(sortedBrands);
            } catch (err) {
                console.error('Error cargando marcas:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return <PageLoader message="Cargando marcas..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" itemScope itemType="https://schema.org/ItemList">
                <div className="text-red-500 text-center p-4">
                    <h1 className="text-xl font-bold mb-2">Error al cargar las marcas</h1>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 border-sky-950 text-sky-950 rounded hover:bg-sky-500 hover:text-white"
                        aria-label="Reintentar cargar las marcas"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8" itemScope itemType="https://schema.org/ItemList">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Marcas Aliadas</h1>
            <meta itemProp="name" content="Marcas Aliadas" />
            <meta itemProp="description" content="Descubre nuestras marcas aliadas de confianza. Ofrecemos productos de las mejores marcas en el mercado." />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {brands.map((brand, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                        <div className="p-4 flex-grow flex flex-col items-center">
                            {brand.marca_imagen ? (
                                <div itemProp="item" itemScope itemType="https://schema.org/Thing">
                                <img 
                                    src={brand.marca_imagen} 
                                    alt={`Logotipo de ${brand.marca}`}
                                    className="h-24 w-auto object-contain mb-3"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-brand.png';
                                    }}
                                    itemProp="image"
                                />
                                <meta itemProp="name" content={brand.marca} />
                                <meta itemProp="url" content={`${window.location.origin}/productos?marca=${encodeURIComponent(brand.marca)}`} />
                            </div>
                            ) : (
                                <div className="h-24 w-full flex items-center justify-center bg-gray-100 mb-3">
                                    <span className="text-gray-400">Sin imagen</span>
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                                {brand.marca}
                            </h3>
                            {brand.categorias && brand.categorias.length > 0 && (
                                <div className="text-sm text-gray-500 mb-3 text-center space-y-1">
                                    {brand.categorias.map((categoria, i) => (
                                        <div key={i} className="break-words">
                                            {categoria}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleViewProducts(brand.marca)}
                            className="w-full bg-sky-950 text-white py-2 hover:bg-sky-700 transition-colors duration-200 text-sm font-medium"
                        >
                            Ver productos
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}