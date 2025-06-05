import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/cart/use-cart';
import { ProductFilters } from "../components/ProductFilters";
import { ProductSearch } from '../components/ProductSearch';
import { FiFilter, FiX, FiShoppingCart } from 'react-icons/fi';
import ProductSort from '../components/ProductSort';

// CSS module is imported but not used directly in this file
// It's kept for future use with the sticky header

export function Products() {
    const modalRef = useRef(null);
    const { addToCart } = useCart();
    
    // Use custom hooks for products and filters
    const {
        products,
        filteredProducts,
        loading,
        error,
        searchTerm,
        sortOption,
        showMobileFilters,
        setFilteredProducts,
        handleSearch,
        handleSortChange,
        toggleMobileFilters,
        applyAllFilters
    } = useProducts();
    
    const { 
        filters, 
        updateFilters, 
        getFilterOptions,
        initialBrand
    } = useFilters();

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                toggleMobileFilters();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [toggleMobileFilters]);

    // Update filtered products when products, search term, or sort option changes
    useEffect(() => {
        if (products.length > 0) {
            const filtered = applyAllFilters(products, searchTerm, sortOption);
            setFilteredProducts(filtered);
        }
    }, [products, searchTerm, sortOption, applyAllFilters, setFilteredProducts]);
    
    // Update filtered products when filters change
    useEffect(() => {
        if (products.length > 0) {
            const filtered = applyAllFilters(products, searchTerm, sortOption);
            setFilteredProducts(filtered);
        }
    }, [filters, products, searchTerm, sortOption, applyAllFilters, setFilteredProducts]);

    // Get filter options
    const { categories, subcategories, brands, categoryToSubcategories } = getFilterOptions(products);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-200px)]">
                <p>Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Header */}
            <div className="container mx-auto px-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-sky-950 whitespace-nowrap md:pl-7 pt-7 md:pt-2">
                        Nuestros Productos
                    </h1>
                    <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch justify-end">
                        <div className="w-full sm:w-56 self-center md:pt-8">
                            <ProductSearch onSearch={handleSearch} />
                        </div>
                        <div className="w-full sm:w-44 self-center">
                            <ProductSort onSortChange={handleSortChange} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 pt-4">
                {/* Mobile Filter Button */}
                <button 
                    onClick={() => toggleMobileFilters()}
                    className="md:hidden flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md mb-4 w-full"
                >
                    <FiFilter /> Filtrar Productos
                </button>
                
                {/* Desktop Filters */}
                <div className="hidden md:block w-64 lg:w-80 flex-shrink-0">
                    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Filtros</h2>
                        <ProductFilters 
                            categories={categories}
                            subcategories={subcategories}
                            brands={brands}
                            categoryToSubcategories={categoryToSubcategories}
                            onFilterChange={updateFilters}
                            initialBrand={initialBrand}
                        />
                    </div>
                </div>

                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 flex items-start justify-end md:hidden">
                        {/* Overlay */}
                        <div 
                            className="fixed inset-0 bg-[rgba(0,0,0,0.5)]"
                            onClick={toggleMobileFilters}
                        />
                        {/* Modal Content */}
                        <div 
                            ref={modalRef}
                            className="relative h-full w-4/5 max-w-sm bg-white overflow-y-auto animate-slide-in"
                        >
                            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-semibold">Filtros</h2>
                                <button 
                                    onClick={toggleMobileFilters}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Cerrar filtros"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            <div className="p-4">
                                <ProductFilters 
                                    categories={categories}
                                    subcategories={subcategories}
                                    brands={brands}
                                    categoryToSubcategories={categoryToSubcategories}
                                    onFilterChange={updateFilters}
                                    initialBrand={initialBrand}
                                />
                                <div className="mt-4 pt-4 border-t">
                                    <button 
                                        onClick={toggleMobileFilters}
                                        className="w-full bg-sky-950 text-white py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
                                    >
                                        Aplicar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Product List */}
                <div className="flex-1">
                    {error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                                        <div className="relative h-48 flex items-center justify-center p-4">
                                            <img 
                                                src={product.imagen || 'https://via.placeholder.com/300'} 
                                                alt={product.nombre}
                                                className="max-h-full max-w-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300';
                                                }}
                                                loading="lazy"
                                            />
                                            {product.marca_nombre && (
                                                <span className="absolute top-2 right-2 bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {product.marca_nombre}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2" title={product.nombre}>
                                                {product.nombre}
                                            </h2>
                                            <div className="mt-auto pt-4 space-y-2">
                                                <Link 
                                                    to={`/productos/${product.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                                                    className="w-full bg-sky-950 text-white px-4 py-2.5 rounded-md hover:bg-sky-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                                    state={{ productId: product.id }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Ver Detalles
                                                </Link>
                                                <button 
                                                    onClick={() => addToCart(product)}
                                                    className="w-full border border-sky-950 text-sky-950 px-4 py-2.5 rounded-md hover:bg-sky-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                                >
                                                    <FiShoppingCart className="text-sky-700" />
                                                    Agregar al Carrito
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 mb-4">No se encontraron productos con los filtros seleccionados.</p>
                                    <button 
                                        onClick={() => updateFilters({ categories: [], subcategories: [], brands: [] })}
                                        className="text-sky-600 hover:underline font-medium"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}