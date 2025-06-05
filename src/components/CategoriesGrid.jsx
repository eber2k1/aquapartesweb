import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';

// Categorías de ejemplo por si la API falla
const SAMPLE_CATEGORIES = [
    { 
        categoria: 'Bombas',
        categoria_imagen: 'https://via.placeholder.com/100x100?text=Bombas'
    },
    { 
        categoria: 'Filtros',
        categoria_imagen: 'https://via.placeholder.com/100x100?text=Filtros'
    },
    { 
        categoria: 'Químicos',
        categoria_imagen: 'https://via.placeholder.com/100x100?text=Quimicos'
    },
    { 
        categoria: 'Accesorios',
        categoria_imagen: 'https://via.placeholder.com/100x100?text=Accesorios'
    },
    { 
        categoria: 'Repuestos',
        categoria_imagen: 'https://via.placeholder.com/100x100?text=Repuestos'
    },
];

export const CategoriesGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateFilters } = useFilters();
    const scrollContainerRef = useRef(null);
    const scrollInterval = useRef(null);
    const SCROLL_SPEED = 0.5; // Velocidad de desplazamiento (píxeles por frame) - Reducida para que sea más lento

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesApi.getCategories();
                
                if (!data || !Array.isArray(data)) {
                    setCategories(SAMPLE_CATEGORIES);
                    return;
                }
                
                // Filtrar categorías vacías o inválidas
                const validCategories = data.filter(cat => cat && cat.categoria);
                
                // Eliminar duplicados
                const uniqueCategories = validCategories.filter(
                    (cat, index, self) => 
                        index === self.findIndex(c => c.categoria === cat.categoria)
                );
                
                if (uniqueCategories.length > 0) {
                    setCategories(uniqueCategories);
                } else {
                    setCategories(SAMPLE_CATEGORIES);
                }
            } catch (_) {
                setError('No se pudieron cargar las categorías. Mostrando datos de ejemplo.');
                setCategories(SAMPLE_CATEGORIES);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (loading || categories.length === 0) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollPosition = 0;
        const containerWidth = container.scrollWidth / 3; // Para efecto infinito

        const startScrolling = () => {
            scrollInterval.current = window.requestAnimationFrame(function scroll() {
                scrollPosition += SCROLL_SPEED;
                
                // Reiniciar posición cuando llegue al final
                if (scrollPosition >= containerWidth) {
                    scrollPosition = 0;
                }
                
                container.scrollLeft = scrollPosition;
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

        // Pausar al pasar el ratón
        container.addEventListener('mouseenter', pauseScrolling);
        container.addEventListener('mouseleave', startScrolling);

        // Pausar al cambiar de pestaña
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
            container.removeEventListener('mouseenter', pauseScrolling);
            container.removeEventListener('mouseleave', startScrolling);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loading, categories.length]);

    const handleCategoryClick = (category) => {
        updateFilters({ 
            categories: [category.categoria],
            brands: [],
            subcategories: []
        });
        // Navigate to products page
        navigate('/productos');
    };

    if (loading) {
        return (
            <div className="py-12 flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-950 mb-4"></div>
                <p className="text-gray-600">Cargando categorías...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center">
                <p className="text-yellow-600 mb-4">{error}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoryClick(category.nombre_categoria)}
                            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                        >
                            {category.imagen_categoria ? (
                                <img
                                    src={category.imagen_categoria}
                                    alt={category.nombre_categoria}
                                    className="h-16 w-16 object-contain mb-4"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-category.png';
                                    }}
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    <span className="text-2xl">{category.nombre_categoria.charAt(0)}</span>
                                </div>
                            )}
                            <h3 className="text-lg font-medium text-gray-900 text-center">
                                {category.nombre_categoria}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Nuestros Productos</h2>
                <div className="relative">
                    <div 
                        ref={scrollContainerRef}
                        className="flex space-x-6 pb-4 overflow-x-hidden -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    >
                        {[...categories, ...categories, ...categories].map((category, index) => (
                            <div
                                key={`${category.categoria}-${index}`}
                                onClick={() => handleCategoryClick(category)}
                                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-80"
                            >
                                {category.categoria_imagen ? (
                                    <div className="h-32 w-32 mb-6 flex items-center justify-center">
                                        <img 
                                            src={category.categoria_imagen} 
                                            alt={category.categoria}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="h-24 w-24 rounded-full bg-sky-100 items-center justify-center hidden">
                                            <span className="text-3xl text-sky-800 font-bold">
                                                {category.categoria.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-sky-100 flex items-center justify-center mb-6">
                                        <span className="text-3xl text-sky-800 font-bold">
                                            {category.categoria.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-xl font-medium text-gray-900 text-center">
                                    {category.categoria}
                                </h3>
                            </div>
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
};
