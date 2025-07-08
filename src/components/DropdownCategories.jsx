import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { categoriesApi } from '../services/api';

export const DropdownCategories = ({ isOpen, onClose, mobileView = false, onItemClick = () => {} }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { updateFilters } = useFilters();
    const navigate = useNavigate();

    // Fetch categories on component mount
    useEffect(() => {
        let isMounted = true;
        
        const fetchCategories = async () => {
            if (categories.length > 0) return; // Skip if already loaded
            
            setIsLoading(true);
            try {
                const data = await categoriesApi.getCategories();
                if (isMounted) {
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchCategories();
        
        return () => {
            isMounted = false; // Cleanup function to prevent state updates after unmount
        };
    }, [categories.length]); // Only re-run if categories.length changes

    const handleCategoryClick = (categoryName) => {
        updateFilters({
            categories: [categoryName],
            subcategories: [],
            brands: []
        });
        navigate('/productos');
        onClose();
    };

    if (!isOpen) return null;

    if (isLoading && categories.length === 0) {
        return (
            <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg p-4 z-50">
                <p>Cargando categorías...</p>
            </div>
        );
    }

    if (mobileView) {
        return (
            <div className="w-full space-y-1 py-2">
                {categories.map((category, index) => (
                    <div 
                        key={index}
                        className="group relative w-full"
                        onClick={() => {
                            handleCategoryClick(category.categoria);
                            onItemClick();
                        }}
                    >
                        <div className="flex items-center px-6 py-3 text-white/90 hover:text-white transition-colors duration-200 group-hover:bg-sky-800/30 rounded-lg ">
                            {category.categoria_imagen && (
                                <div className="w-8 h-8 rounded-md bg-sky-900/50 flex items-center justify-center mr-3 flex-shrink-0">
                                    <img 
                                        src={category.categoria_imagen} 
                                        alt={category.categoria}
                                        className="w-5 h-5 object-contain"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-category.png';
                                        }}
                                    />
                                </div>
                            )}
                            <span className="font-medium text-left flex-grow">{category.categoria}</span>
                            <svg className="w-4 h-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div 
            className={`bg-white shadow-xl z-50 w-full py-4 rounded-xl overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
            onMouseLeave={onClose}
            style={{
                borderTop: '2px solid #0ea5e9',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderTopLeftRadius: '0.75rem',
                borderTopRightRadius: '0.75rem',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem'
            }}
        >
            <div className="w-full px-6">
                <div className="grid grid-cols-4 gap-2 w-full">
                    {categories.map((category, index) => (
                        <div 
                            key={index}
                            className="group flex items-center p-3 hover:bg-sky-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-sky-100 overflow-hidden h-40"
                            onClick={() => handleCategoryClick(category.categoria)}
                        >
                            {category.categoria_imagen && (
                                <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center mr-3 bg-white rounded-xl p-1.5 shadow-sm">
                                    <img 
                                        src={category.categoria_imagen} 
                                        alt={category.categoria}
                                        className="w-25 h-25 object-contain"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-category.png';
                                        }}
                                    />
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-800 group-hover:text-sky-600 transition-colors duration-200 truncate max-w-[280px] block">
                                {category.categoria}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
