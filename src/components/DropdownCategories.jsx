import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../hooks/useFilters';
import { categoriesApi } from '../services/api';

// Loading skeleton component
const CategorySkeleton = () => (
  <div className="group flex flex-col items-center p-4 rounded-2xl border border-gray-100 bg-gray-50/50 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-xl mb-3"></div>
    <div className="w-20 h-4 bg-gray-200 rounded"></div>
  </div>
);

// Mobile category item component
const MobileCategoryItem = ({ category, onClick }) => (
  <div 
    className="group relative w-full cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center px-4 py-3.5 text-white/90 hover:text-white transition-all duration-300 group-hover:bg-white/10 rounded-xl mx-2">
      {category.categoria_imagen && (
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-white/30 transition-all duration-300">
          <img 
            src={category.categoria_imagen} 
            alt={category.categoria}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.target.src = '/placeholder-category.png';
            }}
          />
        </div>
      )}
      <span className="font-medium text-left flex-grow">{category.categoria}</span>
      <svg className="w-5 h-5 text-cyan-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

// Desktop category item component
const DesktopCategoryItem = ({ category, onClick }) => (
  <div 
    className="group flex flex-col items-center p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1"
    onClick={onClick}
  >
    {category.categoria_imagen && (
      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 group-hover:from-blue-50 group-hover:to-cyan-50 transition-all duration-300 group-hover:scale-110">
        <img 
          src={category.categoria_imagen} 
          alt={category.categoria}
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.target.src = '/placeholder-category.png';
          }}
        />
      </div>
    )}
    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300 text-center leading-tight">
      {category.categoria}
    </span>
  </div>
);

export const DropdownCategories = ({ isOpen, onClose, mobileView = false, onItemClick = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateFilters } = useFilters();
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchCategories = async () => {
      if (categories.length > 0) return;
      
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
      isMounted = false;
    };
  }, [categories.length]);

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

  // Loading state
  if (isLoading && categories.length === 0) {
    if (mobileView) {
      return (
        <div className="w-full space-y-2 py-4 px-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3 rounded-xl bg-white/10 animate-pulse">
              <div className="w-10 h-10 bg-white/20 rounded-xl mr-4"></div>
              <div className="flex-1 h-4 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow-2xl z-50 w-full py-8 rounded-2xl border border-gray-100">
        <div className="w-full px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-2">
            {[...Array(8)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile view
  if (mobileView) {
    return (
      <div className="w-full space-y-1 py-2">
        {categories.map((category, index) => (
          <MobileCategoryItem
            key={`mobile-${category.categoria}-${index}`}
            category={category}
            onClick={() => {
              handleCategoryClick(category.categoria);
              onItemClick();
            }}
          />
        ))}
      </div>
    );
  }

  // Desktop view
  return (
    <div 
      className="bg-white shadow-2xl z-50 w-full py-8 rounded-2xl border border-gray-100 backdrop-blur-sm"
      onMouseLeave={onClose}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header */}
      <div className="px-8 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Categorías</h3>
        <p className="text-sm text-gray-500">Explora nuestros productos por categoría</p>
      </div>
      
      {/* Categories Grid */}
      <div className="w-full px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-2">
          {categories.map((category, index) => (
            <DesktopCategoryItem
              key={`desktop-${category.categoria}-${index}`}
              category={category}
              onClick={() => handleCategoryClick(category.categoria)}
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-8 mt-6 pt-6">
        <p className="text-xs text-gray-400 text-center">
          {categories.length} categorías disponibles
        </p>
      </div>
    </div>
  );
};
