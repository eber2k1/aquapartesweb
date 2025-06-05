import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const ProductSort = ({ onSortChange }) => {
    const [sortBy, setSortBy] = useState('name-asc');

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        if (onSortChange) {
            onSortChange(value);
        }
    };

    return (
        <div className="w-full h-full flex items-center">
            <label htmlFor="sort" className="sr-only">
                Ordenar por
            </label>
            <div className="relative w-full">
                <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                >
                    <option value="name-asc">
                        Nombre (A-Z)
                    </option>
                    <option value="name-desc">
                        Nombre (Z-A)
                    </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductSort;
