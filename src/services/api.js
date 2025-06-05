const API_BASE_URL = 'https://aquapartesapi.vercel.app/api';

export const productsApi = {
    getProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        return await response.json();
    },
    
    getProductById: async (id) => {
        // Primero intentamos obtener el producto por ID (asumiendo que es numérico)
        try {
            const response = await fetch(`${API_BASE_URL}/productosinfo/${id}`);
            if (response.ok) {
                return await response.json();
            }
            // Si no se encuentra por ID, lanzamos error para intentar por slug
            throw new Error('Producto no encontrado por ID');
        } catch {
            // Si falla, intentamos buscar por slug
            try {
                const allProducts = await fetch(`${API_BASE_URL}/productos`).then(res => res.json());
                const product = allProducts.find(p => 
                    p.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id.toLowerCase()
                );
                
                if (product) {
                    // Si encontramos el producto por slug, obtenemos sus detalles completos por ID
                    const detailResponse = await fetch(`${API_BASE_URL}/productosinfo/${product.id}`);
                    if (detailResponse.ok) {
                        return await detailResponse.json();
                    }
                }
                throw new Error('Producto no encontrado');
            } catch (e) {
                throw new Error('Error al cargar el producto: ' + (e.message || 'Producto no encontrado'));
            }
        }
    }
};

export const brandsApi = {
    getBrands: async () => {
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (!response.ok) {
            throw new Error('Error al cargar las marcas');
        }
        return await response.json();
    }
};

export const categoriesApi = {
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error('Error al cargar las categorías');
        }
        return await response.json();
    }
};