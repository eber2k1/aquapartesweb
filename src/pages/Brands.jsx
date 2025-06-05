import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsApi } from '../services/api';
import { useFilters } from '../hooks/useFilters';

export const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { updateFilters } = useFilters();

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-950"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center p-4">
                    <p>Error al cargar las marcas: {error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 border-sky-950 text-sky-950 rounded hover:bg-sky-500 hover:text-white"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Marcas Aliadas</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {brands.map((brand, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                        <div className="p-4 flex-grow flex flex-col items-center">
                            {brand.marca_imagen ? (
                                <img 
                                    src={brand.marca_imagen} 
                                    alt={brand.marca}
                                    className="h-24 w-auto object-contain mb-3"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-brand.png';
                                    }}
                                />
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