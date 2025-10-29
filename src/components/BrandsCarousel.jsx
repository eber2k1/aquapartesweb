import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';

export const BrandsCarousel = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const scrollInterval = useRef(null);
    
    const navigate = useNavigate();
    const { replaceFilters } = useFilters();
    
    const SCROLL_SPEED = 0.8;
    const PAUSE_ON_HOVER = true;

    const handleBrandClick = (brandName) => {
        try {
            replaceFilters({ 
                brands: [brandName],
                categories: [],
                subcategories: []
            });
            navigate('/productos');
        } catch (error) {
            console.error('Error navigating to products:', error);
        }
    };

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setError(null);
                const data = await brandsApi.getBrands();
                
                // Simplemente usar los datos tal como vienen de la API
                if (Array.isArray(data) && data.length > 0) {
                    // Duplicar para el efecto de scroll infinito
                    setBrands([...data, ...data, ...data]);
                } else {
                    setBrands([]);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
                setError('Error loading brands');
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        if (loading || !carouselRef.current) return;

        const carousel = carouselRef.current;
        const containerWidth = carousel.scrollWidth / 3;
        let scrollPosition = 0;

        const startScrolling = () => {
            scrollInterval.current = window.requestAnimationFrame(function scroll() {
                scrollPosition += SCROLL_SPEED;
                
                if (scrollPosition >= containerWidth) {
                    scrollPosition = 0;
                }
                
                carousel.scrollLeft = scrollPosition;
                scrollInterval.current = window.requestAnimationFrame(scroll);
            });
        };

        const pauseScrolling = () => {
            if (scrollInterval.current) {
                cancelAnimationFrame(scrollInterval.current);
                scrollInterval.current = null;
            }
        };

        startScrolling();

        if (PAUSE_ON_HOVER) {
            carousel.addEventListener('mouseenter', pauseScrolling);
            carousel.addEventListener('mouseleave', startScrolling);
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                pauseScrolling();
            } else {
                startScrolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            pauseScrolling();
            carousel.removeEventListener('mouseenter', pauseScrolling);
            carousel.removeEventListener('mouseleave', startScrolling);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loading, PAUSE_ON_HOVER]);

    if (error || (!loading && brands.length === 0)) {
        return (
            <section className="bg-sky-700/10 backdrop-blur-sm py-2 mt-0.5 w-full overflow-hidden border-t-20 border-b-6 border-white">
                <div className="text-center text-gray-500 text-sm py-4">
                    {error ? 'Error cargando marcas' : 'No hay marcas disponibles'}
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <div className="py-2 flex justify-center bg-sky-500/40 backdrop-blur-sm mt-0.5 border-t-2 border-b-2 border-white">
                <div className="animate-pulse flex space-x-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="bg-sky-700/10 backdrop-blur-sm py-2 mt-0.5 w-full overflow-hidden border-t-20 border-b-6 border-white">
            <div className="w-full">
                <div 
                    ref={carouselRef}
                    className="flex items-center overflow-hidden w-full relative"
                    style={{
                        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                        maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-30 pointer-events-none"></div>
                    
                    <div className="flex w-full items-center">
                        {brands.map((brand, index) => (
                            <button
                                onClick={() => handleBrandClick(brand.marca)}
                                key={`${brand.id}-${index}`}
                                className="group flex-shrink-0 mx-3 flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1 relative cursor-pointer"
                                style={{ width: '120px', height: '50px' }}
                                aria-label={`Ver productos de la marca ${brand.marca}`}
                            >
                                <div className="absolute inset-0 bg-white/80 rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 -z-10"></div>
                                
                                <div className="h-14 w-32 flex items-center justify-center bg-transparent rounded-lg overflow-hidden group-hover:bg-transparent transition-all duration-500 ease-out">
                                    {brand.marca_imagen ? (
                                        <img 
                                            src={brand.marca_imagen} 
                                            alt={brand.marca}
                                            className="w-24 h-10 object-contain object-center filter grayscale-0 group-hover:grayscale-0 transition-all duration-500 ease-out opacity-80 group-hover:opacity-100"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <span 
                                        className={`text-xs text-gray-500 text-center font-medium tracking-wide group-hover:text-gray-700 transition-colors duration-300 ${brand.marca_imagen ? 'hidden' : 'block'}`}
                                    >
                                        {brand.marca}
                                    </span>
                                </div>
                                
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-sky-200 to-sky-900 group-hover:w-8 transition-all duration-500 ease-out rounded-full"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};