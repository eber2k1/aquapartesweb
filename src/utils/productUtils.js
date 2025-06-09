// Helper function to generate meta description based on filters
export const getMetaDescription = (filters) => {
    const { categories = [], brands = [] } = filters || {};
    let description = 'Explora nuestra amplia selección de productos de calidad';
    
    if (categories?.length > 0) {
        description += ` en ${categories.join(', ')}`;
    }
    if (brands?.length > 0) {
        description += ` de las marcas ${brands.join(', ')}`;
    }
    
    return `${description}. Encuentra los mejores precios y ofertas en nuestra tienda en línea.`;
};

// Helper function to generate breadcrumb items
export const generateBreadcrumbItems = (filters) => {
    const items = [
        { name: 'Inicio', path: '/' },
        { name: 'Productos', path: '/productos' }
    ];
    
    if (filters?.categories?.length > 0) {
        items.push({
            name: filters.categories[0],
            path: `/categorias/${filters.categories[0].toLowerCase().replace(/\s+/g, '-')}`
        });
    }
    
    if (filters?.subcategories?.length > 0) {
        items.push({
            name: filters.subcategories[0],
            path: ''
        });
    }
    
    return items;
};

// Helper function to generate structured data for SEO
export const generateStructuredData = (products, currentUrl) => {
    if (!products || products.length === 0) return null;
    
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': products.map((product, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
                '@type': 'Product',
                'name': product.nombre,
                'description': product.descripcion,
                'image': product.imagen || 'https://via.placeholder.com/300',
                'offers': {
                    '@type': 'Offer',
                    'price': product.precio?.toString() || '0',
                    'priceCurrency': 'COP',
                    'availability': product.disponibilidad ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
                },
                'url': `${currentUrl}/productos/${product.nombre?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
            }
        }))
    };
};
