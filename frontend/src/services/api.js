const API_URL = 'http://localhost:3001/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
    }
    return response.json();
};

// API DE AUTENTICACION
const auth = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        });
        return handleResponse(response);
    },

    getUsers: async() => {
        const response = await fetch(`${API_URL}/auth/users`);
        return handleResponse(response);
    }
};

// API DE PRODUCTOS
const products = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/products`);
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`);
        return handleResponse(response);
    },

    search: async (query) => {
        const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
        return handleResponse(response);
    },

    create: async (productData) => {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    update: async(id, productData) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    delete: async(id) => {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    },

    updateStock: async (id, quantity) => {
        const response = await fetch(`${API_URL}/products/${id}/stock`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({quantity})
        });
        return handleResponse(response);
    }
};

// API DE VENTAS
const sales = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/sales`);
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/sales/${id}`);
        return handleResponse(response);
    },

    create: async (saleData) => {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saleData)
        });
        return handleResponse(response);
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/sales/stats`);
        return handleResponse(response);
    }
};

export const api = {
    auth,
    products,
    sales
};

export { API_URL };
