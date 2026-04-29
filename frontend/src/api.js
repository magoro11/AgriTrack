import axios from 'axios'
import { clearStoredAuth, getStoredAuth, updateStoredAccessToken } from './auth'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

// Production can point directly at the deployed backend via VITE_API_URL.
// Development uses same-origin `/api` by default so Vite can proxy to Django.
export const API_BASE_URL = configuredApiUrl || '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

export async function refreshAccessToken() {
    const { refreshToken } = getStoredAuth()
    if (!refreshToken) {
        throw new Error('No refresh token available')
    }

    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken
    })

    const { access } = response.data
    updateStoredAccessToken(access)
    api.defaults.headers.common.Authorization = `Bearer ${access}`
    return access
}

api.interceptors.request.use((config) => {
    const { accessToken: token } = getStoredAuth()
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                }).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            const { refreshToken } = getStoredAuth()
            if (!refreshToken) {
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const access = await refreshAccessToken()
                processQueue(null, access)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                clearStoredAuth()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
