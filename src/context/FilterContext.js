import { createContext } from 'react';

export const FilterContext = createContext({
    filters: {
        categories: [],
        subcategories: [],
        brands: []
    },
    initialBrand: null,
    updateFilters: () => {},
    clearFilters: () => {},
    applyFilters: () => {},
    getFilterOptions: () => ({}),
    updateInitialBrand: () => {}
});
