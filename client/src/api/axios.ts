import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_URL,
	withCredentials: true,
	// Don't force a Content-Type header here. Let axios/set the correct header per-request
	// (multipart/form-data needs a boundary that the browser creates automatically).
	headers: {
		"Accept": "application/json",
	},

});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Add response interceptor to handle 401s
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Attempt to refresh the token
				const response = await api.get("/refresh");
				const { token } = response.data;

				if (token) {
					localStorage.setItem("token", token);
					api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				// If refresh fails, clear token and redirect to login
				console.error(refreshError, 'refresherror');

				localStorage.removeItem("token");
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
);

// Define error type for type safety
interface ApiError extends Error {
	config: any;
	response?: {
		status: number;
		data: any;
	};
}

api.interceptors.response.use(
	(res) => {
		return res;
	},
	async (error: ApiError) => {
		const originalRequest = error.config;

		// Handle 401 responses that aren't from the refresh endpoint
		if (error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes('/refresh')) {

			originalRequest._retry = true;

			try {
				// Try to refresh token
				const refreshURL = import.meta.env.VITE_APP_REFRESH__URL;
				const response = await api.get(refreshURL);

				if (response.data?.token) {
					localStorage.setItem('token', response.data.token);
					originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				const error = refreshError as ApiError;
				// Only clear token and redirect on explicit auth failures
				if (error.response?.status === 401) {
					localStorage.removeItem("token");

					// Avoid redirect loops and unnecessary redirects
					const publicPaths = ['/login', '/register', '/', '/us', '/stories', '/partners', '/contact'];
					const currentPath = window.location.pathname;

					if (!publicPaths.some(path => currentPath.startsWith(path))) {
						window.location.href = "/";
					}
				}
			}
		}
		return Promise.reject(error);
	}
);

export default api;
