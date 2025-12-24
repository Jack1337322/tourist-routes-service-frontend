import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/me/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
}

// Attractions API
export const attractionsAPI = {
  list: (params) => api.get('/attractions/', { params }),
  get: (id) => api.get(`/attractions/${id}/`),
  nearby: (lat, lng, radius) =>
    api.get('/attractions/nearby/', { params: { lat, lng, radius } }),
}

// Routes API
export const routesAPI = {
  list: (params) => api.get('/routes/', { params }),
  get: (id) => api.get(`/routes/${id}/`),
  create: (data) => api.post('/routes/', data),
  update: (id, data) => api.put(`/routes/${id}/`, data),
  delete: (id) => api.delete(`/routes/${id}/`),
  generate: (data) => api.post('/routes/generate/', data),
  optimize: (id) => api.post(`/routes/${id}/optimize/`),
  favorites: () => api.get('/routes/favorites/'),
  toggleFavorite: (id) => api.post(`/routes/${id}/toggle_favorite/`),
}

// Analytics API
export const analyticsAPI = {
  popularRoutes: (limit) => api.get('/analytics/popular/', { params: { limit } }),
  routeStats: () => api.get('/analytics/stats/'),
  attractionStats: () => api.get('/analytics/attractions/stats/'),
  popularityChart: (limit) => api.get('/analytics/charts/popularity/', { params: { limit } }),
  categoryChart: () => api.get('/analytics/charts/categories/'),
  ratingChart: () => api.get('/analytics/charts/ratings/'),
  userAnalytics: () => api.get('/analytics/user/'),
}

export default api
