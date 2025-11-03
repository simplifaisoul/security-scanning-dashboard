import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail)
    } else {
      toast.error('An error occurred. Please try again.')
    }
    return Promise.reject(error)
  }
)

// WebSocket connection for real-time updates
export const createWebSocketConnection = () => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return ws
}

// API methods
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

export const scansAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/scans', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/scans/${id}`)
    return response.data
  },
  
  create: async (scanData) => {
    const response = await api.post('/scans', scanData)
    return response.data
  },
  
  update: async (id, scanData) => {
    const response = await api.put(`/scans/${id}`, scanData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/scans/${id}`)
    return response.data
  },
  
  getStatus: async (id) => {
    const response = await api.get(`/scans/${id}/status`)
    return response.data
  },
  
  export: async (id, format = 'json') => {
    const response = await api.post(`/scans/${id}/export`, { format })
    return response.data
  },
}

export const toolsAPI = {
  getAll: async () => {
    const response = await api.get('/tools')
    return response.data
  },
  
  getConfig: async (toolId) => {
    const response = await api.get(`/tools/${toolId}/config`)
    return response.data
  },
  
  execute: async (toolId, config) => {
    const response = await api.post(`/tools/${toolId}/execute`, config)
    return response.data
  },
}

export const statsAPI = {
  getSystem: async () => {
    const response = await api.get('/stats/system')
    return response.data
  },
  
  getScans: async (timeRange = '7d') => {
    const response = await api.get(`/stats/scans?range=${timeRange}`)
    return response.data
  },
  
  getThreats: async (timeRange = '7d') => {
    const response = await api.get(`/stats/threats?range=${timeRange}`)
    return response.data
  },
}

export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings')
    return response.data
  },
  
  update: async (settings) => {
    const response = await api.put('/settings', settings)
    return response.data
  },
}

export default api