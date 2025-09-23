import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from './PageLoader';

// Brand card component - Minimalist design
const BrandCard = ({ brand, onBrandClick, onViewProducts }) => {
  const hasCategories = brand.categories && brand.categories.length > 0;
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 cursor-pointer hover:-translate-y-0.5 h-full flex flex-col"
      onClick={() => onBrandClick(brand.marca)}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Brand Image */}
        <div className="flex-shrink-0 mb-3">
          <div className="h-16 w-full flex items-center justify-center">
            {brand.marca_imagen ? (
              <img 
                src={brand.marca_imagen} 
                alt={`${brand.marca}`}
                className="max-h-12 max-w-full object-contain hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-brand.png';
                }}
              />
            ) : (
              <span className="text-gray-700 font-medium">{brand.marca}</span>
            )}
          </div>
        </div>
        
        {/* Brand Name */}
        <div className="mb-3 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900 text-center">
            {brand.marca}
          </h2>
        </div>
        
        {/* Categories */}
        <div className="flex-grow flex items-start">
          <div className="w-full">
            {hasCategories ? (
              <div className="flex flex-wrap gap-1 justify-center">
                {brand.categories
                  .filter(cat => cat && cat.trim() !== '')
                  .slice(0, 2)
                  .map((categoria, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProducts(brand.marca, categoria);
                      }}
                      title={`Ver productos de ${categoria}`}
                    >
                      {categoria}
                    </span>
                  ))
                }
                {brand.categories.filter(cat => cat && cat.trim() !== '').length > 2 && (
                  <span className="px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-500">
                    +{brand.categories.filter(cat => cat && cat.trim() !== '').length - 2}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center">
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">Muy pronto con productos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimalist header component
const BrandsHeader = ({ searchTerm, onSearchChange, totalBrands, filteredCount }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Representacion tecnica y comercial
        </h1>
        <p className="text-gray-600">
          Descubre nuestra selección de {totalBrands} socios estrategicos
        </p>
      </div>
      
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar marcas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              {filteredCount} resultado{filteredCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Minimalist empty state
const EmptyState = ({ searchTerm, onClearSearch }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron marcas</h3>
    <p className="text-gray-600 mb-6">
      {searchTerm ? (
        <>No hay marcas que coincidan con "{searchTerm}"</>
      ) : (
        'No hay marcas disponibles'
      )}
    </p>
    {searchTerm && (
      <button
        onClick={onClearSearch}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Limpiar búsqueda
      </button>
    )}
  </div>
);

export default function AllBrands({ brands, loading, error, onViewProducts }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBrandClick = (brandName) => {
    if (brandName) {
      navigate(`/productos?marca=${encodeURIComponent(brandName)}`);
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (brand.categories && brand.categories.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (loading) {
    return <PageLoader message="Cargando marcas..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar las marcas</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <BrandsHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalBrands={brands.length}
          filteredCount={filteredBrands.length}
        />
        
        {filteredBrands.length === 0 ? (
          <EmptyState 
            searchTerm={searchTerm} 
            onClearSearch={() => setSearchTerm('')}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredBrands.map((brand, index) => (
                <BrandCard
                  key={`${brand.marca}-${index}`}
                  brand={brand}
                  onBrandClick={handleBrandClick}
                  onViewProducts={onViewProducts}
                />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600">
                {filteredBrands.length} de {brands.length} marcas
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}