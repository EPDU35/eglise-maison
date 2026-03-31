const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-url.vercel.app/api'
        : 'http://localhost:5000/api',
    
    ENDPOINTS: {
        LOGIN: '/auth/login',
        INIT: '/auth/init',
        INSCRITS: '/inscrits',
        INSCRITS_STATS: '/inscrits/stats',
        USERS: '/users',
        USERS_PASSWORD: '/users/password'
    },

    getToken: () => {
        return sessionStorage.getItem('token');
    },

    setToken: (token) => {
        sessionStorage.setItem('token', token);
    },

    clearToken: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
    },

    getHeaders: (includeAuth = false) => {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (includeAuth) {
            const token = API_CONFIG.getToken();
            if (token) {
                headers['x-auth-token'] = token;
            }
        }
        
        return headers;
    }
};