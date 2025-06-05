import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterContext } from './FilterContext';

export const FilterProvider = ({ children }) => {
    const [searchParams] = useSearchParams();
    const [initialBrand, setInitialBrand] = useState(null);
    const [filters, setFilters] = useState({
        categories: [],
        subcategories: [],
        brands: []
    });

    // Get brand from URL parameter
    const updateInitialBrand = useCallback(() => {
        const brandParam = searchParams.get('marca');
        if (brandParam) {
            const decodedBrand = decodeURIComponent(brandParam);
            setInitialBrand(decodedBrand);
            // Add the brand to filters if it's not already there
            setFilters(prev => ({
                ...prev,
                brands: prev.brands.includes(decodedBrand) ? prev.brands : [...prev.brands, decodedBrand]
            }));
        } else {
            setInitialBrand(null);
        }
    }, [searchParams]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters({
            categories: [],
            subcategories: [],
            brands: []
        });
    }, []);

    // Apply filters to products
    const applyFilters = useCallback((products) => {
        if (!products || !Array.isArray(products)) return [];

        return products.filter(product => {
            // Filter by categories
            if (filters.categories.length > 0 && !filters.categories.includes(product.categoria_nombre)) {
                return false;
            }
            
            // Filter by subcategories
            if (filters.subcategories.length > 0 && !filters.subcategories.includes(product.subcategoria_nombre)) {
                return false;
            }
            
            // Filter by brands
            if (filters.brands.length > 0 && !filters.brands.includes(product.marca_nombre)) {
                return false;
            }
            
            return true;
        });
    }, [filters]);

    // Get unique values for filters
    const getFilterOptions = useCallback((products) => {
        if (!products || !Array.isArray(products)) {
            return {
                categories: [],
                subcategories: [],
                brands: [],
                categoryToSubcategories: {}
            };
        }

        const categories = [...new Set(products.map(p => p.categoria_nombre).filter(Boolean))];
        const subcategories = [...new Set(products.map(p => p.subcategoria_nombre).filter(Boolean))];
        const brands = [...new Set(products.map(p => p.marca_nombre).filter(Boolean))];

        // Create category to subcategories map
        const categoryToSubcategories = products.reduce((acc, product) => {
            if (!product.categoria_nombre || !product.subcategoria_nombre) return acc;
            
            if (!acc[product.categoria_nombre]) {
                acc[product.categoria_nombre] = new Set();
            }
            acc[product.categoria_nombre].add(product.subcategoria_nombre);
            return acc;
        }, {});

        // Convert Sets to Arrays
        Object.keys(categoryToSubcategories).forEach(key => {
            categoryToSubcategories[key] = Array.from(categoryToSubcategories[key]);
        });

        return {
            categories,
            subcategories,
            brands,
            categoryToSubcategories
        };
    }, []);

    return (
        <FilterContext.Provider
            value={{
                filters,
                initialBrand,
                updateFilters,
                clearFilters,
                applyFilters,
                getFilterOptions,
                updateInitialBrand
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};