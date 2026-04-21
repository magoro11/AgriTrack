import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('agri_access_token')
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config

        if (error.response ? .status === 401 && !originalRequest._retry) {
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

            const refreshToken = localStorage.getItem('agri_refresh_token')
            if (!refreshToken) {
                // No refresh token, redirect to login
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                    refresh: refreshToken
                })
                const { access } = response.data
                localStorage.setItem('agri_access_token', access)
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`
                processQueue(null, access)
                return api(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                    // Refresh failed, redirect to login
                localStorage.removeItem('agri_access_token')
                localStorage.removeItem('agri_refresh_token')
                localStorage.removeItem('agri_user_role')
                localStorage.removeItem('agri_user_email')
                localStorage.removeItem('agri_user_name')
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