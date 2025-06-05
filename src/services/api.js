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
        const response = await fetch(`${API_BASE_URL}/productosinfo/${id}`);
        if (!response.ok) {
            throw new Error('Error al cargar el producto');
        }
        return await response.json();
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