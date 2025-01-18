"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeApi = void 0;
const axios_1 = __importDefault(require("axios"));
// iOS Simulator için localhost kullanılır
const BASE_URL = 'http://localhost:3000/api';
const api = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 saniye timeout
});
// Debug için request interceptor
api.interceptors.request.use(config => {
    var _a;
    console.log('🚀 Request:', (_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase(), config.url);
    if (config.data) {
        console.log('📦 Request Data:', config.data);
    }
    return config;
}, error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
});
// Debug için response interceptor
api.interceptors.response.use(response => {
    console.log('✅ Response:', response.status, response.config.url);
    if (response.data) {
        console.log('📦 Response Data:', response.data);
    }
    return response;
}, error => {
    if (error.code === 'ECONNABORTED') {
        console.error('⏰ Request timeout');
    }
    else if (!error.response) {
        console.error('🌐 Network error:', error.message);
    }
    else {
        console.error('❌ Response Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
});
exports.routeApi = {
    // Yeni rota ekleme
    createRoute: async (routeData) => {
        try {
            const response = await api.post('/routes', routeData);
            return response.data;
        }
        catch (error) {
            console.error('Error creating route:', error);
            throw error;
        }
    },
    // Rotaları listeleme
    getRoutes: async () => {
        try {
            const response = await api.get('/routes');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    },
    // Rota silme
    deleteRoute: async (routeId) => {
        try {
            await api.delete(`/routes/${routeId}`);
        }
        catch (error) {
            console.error('Error deleting route:', error);
            throw error;
        }
    },
    // Rota güncelleme (favori durumu için)
    updateRoute: async (routeId, updates) => {
        try {
            const response = await api.patch(`/routes/${routeId}`, updates);
            return response.data;
        }
        catch (error) {
            console.error('Error updating route:', error);
            throw error;
        }
    },
};
