import { useEffect, useRef, useState } from 'react';
import { brandsApi } from '../services/api';
import { Link } from 'react-router-dom';

export const BrandsCarousel = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const scrollInterval = useRef(null);
    const SCROLL_SPEED = 1; // Pixels to move per frame
    const PAUSE_ON_HOVER = true; // Pause autoscroll on hover

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await brandsApi.getBrands();
                
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
                
                // Duplicar para el efecto de desplazamiento infinito
                setBrands([...groupedBrands, ...groupedBrands, ...groupedBrands]);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        if (loading || !carouselRef.current) return;

        const carousel = carouselRef.current;
        const containerWidth = carousel.scrollWidth / 3; // Since we tripled the items
        let scrollPosition = 0;

        const startScrolling = () => {
            scrollInterval.current = window.requestAnimationFrame(function scroll() {
                scrollPosition += SCROLL_SPEED;
                
                // Reset position when we've scrolled one full container width
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

        // Pause on window blur (tab change)
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
    }, [loading]);

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-950"></div>
            </div>
        );
    }


    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Marcas Aliadas</h2>
                <div 
                    ref={carouselRef}
                    className="flex items-center overflow-hidden py-4"
                    style={{
                        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
                        maskImage: 'linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)',
                    }}
                >
                    <div className="flex">
                        {brands.map((brand, index) => (
                            <Link 
                                to={`/marcas`} 
                                key={`${brand.id}-${index}`}
                                className="flex-shrink-0 px-6 py-3 flex flex-col items-center justify-center transition-transform hover:scale-105"
                                style={{ width: '200px' }}
                            >
                                <div className="h-20 w-32 flex items-center justify-center mb-2 bg-white rounded-lg shadow-sm overflow-hidden">
                                    {brand.marca_imagen ? (
                                        <img 
                                            src={brand.marca_imagen} 
                                            alt={brand.marca}
                                            width={128}
                                            height={80}
                                            className="w-full h-full object-contain p-2"
                                            loading="lazy"
                                            style={{
                                                contentVisibility: 'auto',
                                                aspectRatio: '16/10'
                                            }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <span 
                                        className={`text-sm text-gray-500 text-center ${brand.marca_imagen ? 'hidden' : 'block'}`}
                                        style={{
                                            display: brand.marca_imagen ? 'none' : 'block'
                                        }}
                                    >
                                        {brand.marca}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center mt-2">
                                    {brand.marca}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
