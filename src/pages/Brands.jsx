import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brandsApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';
import PageLoader from '../components/PageLoader';
import AllBrands from '../components/AllBrands';

export const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';

    const { replaceFilters } = useFilters();
    
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
                'name': brand.marca, // Usando el alias 'marca' de la nueva query
                'description': `Productos de la marca ${brand.marca} disponibles en AquaPartes`,
                'url': `${window.location.origin}/productos?marca=${encodeURIComponent(brand.marca)}`,
                'logo': brand.marca_imagen || 'https://via.placeholder.com/150' // Usando el alias 'marca_imagen'
            }))
        });
        
        document.head.appendChild(script);
        
        return () => {
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, [brands]);

    const handleViewProducts = (brandName, category = null) => {
        // Reemplazar completamente los filtros
        replaceFilters({ 
            brands: [brandName],
            categories: category ? [category] : [],
            subcategories: []
        });
        navigate('/productos');
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandsApi.getBrands();
                
                // Procesar las categorías que vienen como string separado por comas
                const processedBrands = data.map(brand => ({
                    ...brand,
                    // Convertir la cadena de categorías en un array
                    categories: brand.categorias && brand.categorias !== 'Sin categoría' 
                        ? brand.categorias.split(', ').filter(cat => cat.trim()) 
                        : []
                }));
                
                // El ordenamiento ya se hace en la consulta SQL (ORDER BY m.relevancia DESC, m.nombre ASC)
                // pero podemos mantener el ordenamiento aquí por seguridad
                const sortedBrands = [...processedBrands].sort((a, b) => {
                    // Primero ordenar por relevancia (relevancia 1 va primero)
                    if (a.relevancia !== b.relevancia) {
                        return b.relevancia - a.relevancia; // 1 antes que 0
                    }
                    // Si tienen la misma relevancia, ordenar alfabéticamente
                    return a.marca.localeCompare(b.marca, 'es', {sensitivity: 'base'});
                });
                
                setBrands(sortedBrands);
            } catch (err) {
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
        <div className="min-h-screen bg-gray-50">
            <AllBrands 
                brands={brands}
                loading={loading}
                error={error}
                onViewProducts={handleViewProducts} 
            />
        </div>
    );
};

export default Brands;