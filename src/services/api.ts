import axios from 'axios';

// iOS Simulator için localhost kullanılır
const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 saniye timeout
});

// Debug için request interceptor
api.interceptors.request.use(
  config => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    if (config.data) {
      console.log('📦 Request Data:', config.data);
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Debug için response interceptor
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.status, response.config.url);
    if (response.data) {
      console.log('📦 Response Data:', response.data);
    }
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    } else if (!error.response) {
      console.error('🌐 Network error:', error.message);
    } else {
      console.error('❌ Response Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export interface RoutePoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface Route {
  id?: string;
  title: string;
  type: string;
  points: RoutePoint[];
  coverPhoto?: string;
  tags: string[];
  duration?: string;
  distance?: string;
  rating?: number;
  createdAt?: string;
  isFavorite?: boolean;
  visitCount?: number;
  lastVisited?: string;
}

export const routeApi = {
  // Yeni rota ekleme
  createRoute: async (routeData: Omit<Route, 'id'>) => {
    try {
      const response = await api.post('/routes', routeData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },

  // Rotaları listeleme
  getRoutes: async () => {
    try {
      const response = await api.get('/routes');
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Rota silme
  deleteRoute: async (routeId: string) => {
    try {
      await api.delete(`/routes/${routeId}`);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  },

  // Rota güncelleme (favori durumu için)
  updateRoute: async (routeId: string, updates: Partial<Route>) => {
    try {
      const response = await api.patch(`/routes/${routeId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  },
}; 