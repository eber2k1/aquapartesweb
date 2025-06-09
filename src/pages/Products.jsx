import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/cart/use-cart';
import { useSeo } from '../hooks/useSeo';
import { getMetaDescription } from '../utils/productUtils';
import { ProductSearch } from '../components/ProductSearch';
import { FiFilter } from 'react-icons/fi';
import ProductSort from '../components/ProductSort';
import PageLoader from '../components/PageLoader';
import { ProductList } from '../components/ProductList';
import { MobileFilters } from '../components/MobileFilters';
import { ProductFilters } from '../components/ProductFilters';

export function Products() {
    const modalRef = useRef(null);
    const location = useLocation();
    const currentUrl = window.location.origin + location.pathname;
    const [pageLoading, setPageLoading] = useState(true);
    
    // Use custom hooks for products and filters
    const {
        products = [],
        filteredProducts = [],
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
    
    // Handle click outside mobile filters
    const handleClickOutside = useCallback((event) => {
        if (showMobileFilters && modalRef.current && !modalRef.current.contains(event.target)) {
            toggleMobileFilters();
        }
    }, [toggleMobileFilters, showMobileFilters]);

    useEffect(() => {
        if (showMobileFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside, showMobileFilters]);

    const { addToCart } = useCart();
    
    // Memoize meta description
    const metaDescription = useMemo(
        () => getMetaDescription(filters),
        [filters]
    );
    
    // SEO and meta tags
    useSeo({
        title: 'Productos',
        description: metaDescription,
        url: currentUrl,
        products: filteredProducts
    });
    
    // Update page loading state
    useEffect(() => {
        if (!loading && products.length > 0) {
            const timer = setTimeout(() => setPageLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, products]);
    
    // Update filtered products when filters change
    const updateFilteredProducts = useCallback(() => {
        if (products.length > 0) {
            const filtered = applyAllFilters(products, searchTerm, sortOption);
            setFilteredProducts(filtered);
        }
    }, [products, searchTerm, sortOption, applyAllFilters, setFilteredProducts]);
    
    // Update filtered products when dependencies change
    useEffect(() => {
        updateFilteredProducts();
    }, [updateFilteredProducts]);
    
    // Get filter options
    const { categories, subcategories, brands, categoryToSubcategories } = useMemo(
        () => getFilterOptions(products),
        [products, getFilterOptions]
    );
    
    // Show loading state within the main content area
    const renderContent = () => {
        if (pageLoading) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <PageLoader message="Cargando productos..." />
                    </div>
                </div>
            );
        }
        
        return (
            <>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Mobile filter button */}
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <button 
                            onClick={toggleMobileFilters}
                            className="flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-md hover:bg-sky-100 transition-colors"
                        >
                            <FiFilter />
                            Filtros
                        </button>
                    </div>
                    
                    {/* Desktop Filters */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <ProductFilters 
                            categories={categories}
                            subcategories={subcategories}
                            brands={brands}
                            categoryToSubcategories={categoryToSubcategories}
                            onFilterChange={updateFilters}
                            initialBrand={initialBrand}
                        />
                    </div>
                    
                    {/* Mobile Filters */}
                    <MobileFilters 
                        isOpen={showMobileFilters}
                        onClose={toggleMobileFilters}
                        categories={categories}
                        subcategories={subcategories}
                        brands={brands}
                        categoryToSubcategories={categoryToSubcategories}
                        onFilterChange={updateFilters}
                        initialBrand={initialBrand}
                    />
                    
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Sort */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <ProductSearch 
                                searchTerm={searchTerm}
                                onSearch={handleSearch}
                                className="flex-1"
                            />
                            <ProductSort 
                                sortOption={sortOption}
                                onSortChange={handleSortChange}
                            />
                        </div>
                        
                        {/* Product List */}
                        <ProductList 
                            products={filteredProducts} 
                            error={error}
                            onAddToCart={addToCart}
                        />
                    </div>
                </div>
            </>
        );
    };

    return <main className="container mx-auto px-4 py-8">{renderContent()}</main>;
}