import { useState, useEffect, Fragment } from 'react';
import { useFilters } from '../hooks/useFilters';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, FunnelIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const CollapsibleSection = ({ title, children, isOpen: propsIsOpen, onToggle }) => {
    const [isOpen, setIsOpen] = useState(propsIsOpen !== undefined ? propsIsOpen : true);
    
    const toggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <div className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <button
                type="button"
                onClick={toggle}
                className="flex justify-between items-center w-full py-2 text-left text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
                <span>{title}</span>
                {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
            </button>
            <div className={`mt-2 space-y-2 ${isOpen ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};

export const ProductFilters = ({ 
    categories = [], 
    brands = [],
    categoryToSubcategories = {},
    initialBrand
}) => {
    const navigate = useNavigate();
    const { 
        filters, 
        updateFilters
    } = useFilters();

    // Handle initial brand
    useEffect(() => {
        if (initialBrand && !filters.brands.includes(initialBrand)) {
            updateFilters({
                ...filters,
                brands: [initialBrand]
            });
        }
    }, [initialBrand, filters, updateFilters]);

    // Get filtered subcategories based on selected categories
    const getFilteredSubcategories = () => {
        if (filters.categories.length === 0) return [];
        
        const allSubcategories = new Set();
        filters.categories.forEach(category => {
            const subs = categoryToSubcategories[category] || [];
            subs.forEach(sub => allSubcategories.add(sub));
        });
        
        return Array.from(allSubcategories);
    };

    const filteredSubcategories = getFilteredSubcategories();

    const handleChange = (e, type) => {
        const { value, checked } = e.target;
        
        const newFilters = {
            ...filters,
            [type]: checked 
                ? [...filters[type], value]
                : filters[type].filter(item => item !== value)
        };

        // If unchecking a category, remove its subcategories
        if (type === 'categories' && !checked) {
            const removedCategory = value;
            const subsToRemove = categoryToSubcategories[removedCategory] || [];
            newFilters.subcategories = newFilters.subcategories.filter(
                sub => !subsToRemove.includes(sub)
            );
        }

        // Si estamos cambiando categorías, limpiamos las subcategorías que ya no son válidas
        if (type === 'categories') {
            const validSubcategories = getFilteredSubcategories();
            newFilters.subcategories = newFilters.subcategories.filter(
                sub => validSubcategories.includes(sub)
            );
        }
        
        updateFilters(newFilters);
    };

    const removeFilter = (type, value) => {
        const newFilters = {
            ...filters,
            [type]: filters[type].filter(item => item !== value)
        };
        updateFilters(newFilters);
        
        // Update URL when removing brand filter
        if (type === 'brands' && newFilters.brands.length === 0) {
            navigate('/productos', { replace: true });
        }
    };

    const isFilterActive = () => {
        return filters.categories.length > 0 || 
               filters.subcategories.length > 0 || 
               filters.brands.length > 0;
    };

    const handleClearFilters = () => {
        updateFilters({
            categories: [],
            subcategories: [],
            brands: []
        });
        
        // Clear URL parameters
        navigate('/productos', { replace: true });
    };

    const [openSections, setOpenSections] = useState({
        categories: true,
        subcategories: true,
        brands: true
    });

    const FilterSection = ({ title, items, type }) => (
        <CollapsibleSection 
            title={title} 
            isOpen={openSections[type]}
            onToggle={(isOpen) => setOpenSections(prev => ({ ...prev, [type]: isOpen }))}
        >
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                    <div key={item} className="flex items-center group">
                        <input
                            id={`filter-${type}-${item.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`}
                            name={`${type}[]`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                            checked={filters[type].includes(item)}
                            onChange={(e) => handleChange(e, type)}
                            value={item}
                        />
                        <label 
                            htmlFor={`filter-${type}-${item.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`}
                            className="ml-3 text-sm text-gray-700 flex-1 py-1 group-hover:text-sky-600 transition-colors"
                        >
                            {item}
                        </label>
                    </div>
                ))}
            </div>
        </CollapsibleSection>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <h2 className="text-base font-medium text-gray-900">Filtros</h2>
                    </div>
                    {isFilterActive() && (
                        <button
                            onClick={handleClearFilters}
                            className="text-sm font-medium text-sky-600 hover:text-sky-800"
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>

            {/* Active filters */}
            {isFilterActive() && (
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {filters.categories.map((category) => (
                            <span
                                key={`cat-${category}`}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-sky-100 text-sky-800"
                            >
                                {category}
                                <button
                                    type="button"
                                    className="flex-shrink-0 ml-1.5 inline-flex h-4 w-4 rounded-md text-sky-500 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                                    onClick={() => removeFilter('categories', category)}
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                        {filters.subcategories.map((subcategory) => (
                            <span
                                key={`sub-${subcategory}`}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800"
                            >
                                {subcategory}
                                <button
                                    type="button"
                                    className="flex-shrink-0 ml-1.5 inline-flex h-4 w-4 rounded-md text-emerald-500 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                                    onClick={() => removeFilter('subcategories', subcategory)}
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                        {filters.brands.map((brand) => (
                            <span
                                key={`brand-${brand}`}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-violet-100 text-violet-800"
                            >
                                {brand}
                                <button
                                    type="button"
                                    className="flex-shrink-0 ml-1.5 inline-flex h-4 w-4 rounded-md text-violet-500 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1"
                                    onClick={() => removeFilter('brands', brand)}
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter sections */}
            <div className="p-4">
                <div className="space-y-4">
                    {categories.length > 0 && (
                        <FilterSection 
                            title="Categorías" 
                            items={categories} 
                            type="categories" 
                        />
                    )}

                    {filteredSubcategories.length > 0 && (
                        <FilterSection 
                            title="Subcategorías" 
                            items={filteredSubcategories} 
                            type="subcategories" 
                        />
                    )}

                    {brands.length > 0 && (
                        <FilterSection 
                            title="Marcas" 
                            items={brands} 
                            type="brands" 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};