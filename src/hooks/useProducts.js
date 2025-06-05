import { useState, useEffect, useCallback, useContext } from 'react';
import { productsApi } from '../services/api';
import { FilterContext } from '../context/FilterContext';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Get filters from context
    const { filters } = useContext(FilterContext);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsApi.getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar los productos:', err);
                setError('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply filters and search
    const applyAllFilters = useCallback((productsToFilter, search, sort) => {
        if (!productsToFilter || productsToFilter.length === 0) return [];
        
        let result = [...productsToFilter];
        
        // Apply search filter
        const trimmedSearch = search.trim();
        if (trimmedSearch) {
            const term = trimmedSearch.toLowerCase();
            result = result.filter(product => {
                const name = product.nombre_producto || product.nombre || product.name || '';
                return name.toLowerCase().includes(term);
            });
        }
        
        // Apply category filter
        if (filters.categories && filters.categories.length > 0) {
            result = result.filter(product => 
                filters.categories.includes(product.categoria_nombre)
            );
        }
        
        // Apply subcategory filter
        if (filters.subcategories && filters.subcategories.length > 0) {
            result = result.filter(product => 
                filters.subcategories.includes(product.subcategoria_nombre)
            );
        }
        
        // Apply brand filter
        if (filters.brands && filters.brands.length > 0) {
            result = result.filter(product => 
                filters.brands.includes(product.marca_nombre)
            );
        }
        
        // Apply sorting
        return [...result].sort((a, b) => {
            const nameA = (a.nombre_producto || a.nombre || a.name || '').toLowerCase();
            const nameB = (b.nombre_producto || b.nombre || b.name || '').toLowerCase();
            
            if (sort === 'name-asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }, [filters]);

    // Handle search
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Handle sort change
    const handleSortChange = (option) => {
        setSortOption(option);
    };

    // Toggle mobile filters
    const toggleMobileFilters = () => {
        setShowMobileFilters(prev => !prev);
    };

    return {
        // State
        products,
        filteredProducts,
        loading,
        error,
        searchTerm,
        sortOption,
        showMobileFilters,
        
        // Actions
        setFilteredProducts,
        handleSearch,
        handleSortChange,
        toggleMobileFilters,
        applyAllFilters
    };
}
