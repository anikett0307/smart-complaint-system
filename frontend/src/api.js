import axios from 'axios'

// Use local proxy (configured in vite.config.js) instead of absolute URL
const API_BASE = '/api'

const client = axios.create({ 
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// Add response error logging
client.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const setToken = (t) => { 
  client.defaults.headers.common.Authorization = `Bearer ${t}` 
}

export default client
