import { FiX } from 'react-icons/fi';

export const MobileFilters = ({
  isOpen,
  onClose,
  categories,
  subcategories,
  brands,
  categoryToSubcategories,
  onFilterChange,
  initialBrand
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative h-full w-4/5 max-w-sm bg-white overflow-y-auto animate-slide-in">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar filtros"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="p-4">
            <ProductFilters 
              categories={categories}
              subcategories={subcategories}
              brands={brands}
              categoryToSubcategories={categoryToSubcategories}
              onFilterChange={onFilterChange}
              initialBrand={initialBrand}
            />
            <div className="mt-4 pt-4 border-t">
              <button 
                onClick={onClose}
                className="w-full bg-sky-950 text-white py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
