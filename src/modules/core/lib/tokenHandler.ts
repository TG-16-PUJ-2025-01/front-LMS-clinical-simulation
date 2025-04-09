import axios from "axios"

export const setToken = (newToken: string): void => {
	localStorage.setItem("token", newToken)
	axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
}

export const clearToken = (): void => {
	localStorage.removeItem("token")
	delete axios.defaults.headers.common["Authorization"]
}

export const getToken = (): string | null => {
	return localStorage.getItem("token")
}

// Interceptor para agregar el token en cada solicitud
axios.interceptors.request.use(
	(config) => {
		const token = getToken()
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Interceptor para manejar errores 401
axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// clearToken()
			// // Redirigir a la página de login
			// window.location.href = "/login"
			console.error("Token inválido o expirado. Por favor, inicia sesión nuevamente.")
		}
		return Promise.reject(error)
	}
)
