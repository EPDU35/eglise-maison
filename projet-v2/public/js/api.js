// Configuration de l'API
const API_URL = '/api';

// Fonction pour récupérer le token
function getToken() {
    return sessionStorage.getItem('token');
}

// Fonction pour les requêtes GET
async function apiGet(endpoint) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['x-auth-token'] = token;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: headers
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
    }
    
    return response.json();
}

// Fonction pour les requêtes POST
async function apiPost(endpoint, data) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['x-auth-token'] = token;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
    }
    
    return response.json();
}

// Fonction pour les requêtes PUT
async function apiPut(endpoint, data) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': token
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
    }
    
    return response.json();
}

// Fonction pour les requêtes DELETE
async function apiDelete(endpoint) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': token
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: headers
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
    }
    
    return response.json();
}

// API Auth
const AuthAPI = {
    login: (identifiant, password) => apiPost('/auth/login', { identifiant, password })
};

// API Inscrits
const InscritsAPI = {
    create: (data) => apiPost('/inscrits', data),
    getAll: (filters = '') => apiGet(`/inscrits${filters}`),
    getById: (id) => apiGet(`/inscrits/${id}`),
    update: (id, data) => apiPut(`/inscrits/${id}`, data),
    delete: (id) => apiDelete(`/inscrits/${id}`),
    getStats: () => apiGet('/inscrits/stats')
};

// API Users
const UsersAPI = {
    getAll: () => apiGet('/users'),
    create: (data) => apiPost('/users', data),
    changePassword: (currentPassword, newPassword) => 
        apiPut('/users/password', { currentPassword, newPassword }),
    delete: (id) => apiDelete(`/users/${id}`)
};