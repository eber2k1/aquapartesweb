import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { categoriesApi } from '../services/api';

export const DropdownCategories = ({ isOpen, onClose, mobileView = false, onItemClick = () => {} }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { updateFilters } = useFilters();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesApi.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

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

    if (loading) {
        return (
            <div className="absolute left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-50">
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
                        <div className="flex items-center px-6 py-3 text-white/90 hover:text-white transition-colors duration-200 group-hover:bg-sky-800/30 rounded-lg">
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
            className="absolute left-0 bg-white shadow-lg rounded-lg py-2 z-50 min-w-[200px] border-2 border-gray-200"
            onMouseLeave={onClose}
        >
            <div className="flex flex-col">
                {categories.map((category, index) => (
                    <div 
                        key={index}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCategoryClick(category.categoria)}
                    >
                        {category.categoria_imagen && (
                            <img 
                                src={category.categoria_imagen} 
                                alt={category.categoria}
                                className="w-10 h-10 object-cover rounded mr-3"
                                onError={(e) => {
                                    e.target.src = '/placeholder-category.png';
                                }}
                            />
                        )}
                        <span className="text-gray-800">{category.categoria}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
