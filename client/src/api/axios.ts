import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_URL,
	withCredentials: true,
	headers: {
		Accept: "application/json",
	},
});

// We'll keep access tokens in memory by setting axios.defaults.headers.common["Authorization"]
// when the client receives a token (login or refresh). Do NOT read/write tokens from localStorage here.

// Use Axios types for errors/config so types align with axios internals
type InternalRequestConfig = AxiosRequestConfig & { _retry?: boolean; url?: string };

// Single response interceptor: handle 401 by attempting a cookie-based refresh
api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError<unknown>) => {
		const originalRequest = error.config as InternalRequestConfig | undefined;

		// If unauthorized and this request hasn't been retried yet, try refresh
		if (
			error.response?.status === 401 &&
			!originalRequest?._retry &&
			!(originalRequest?.url ?? "").includes("/refresh")
		) {
			if (originalRequest) originalRequest._retry = true;

	/* 		try {
				const refreshURL = import.meta.env.VITE_APP_REFRESH__URL || "/refresh";
				const response = await api.get(refreshURL);

				const token = response?.data?.token;
				if (token) {
					// keep token in memory only
					api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
					originalRequest!.headers = (originalRequest!.headers || {}) as Record<string, string>;
					originalRequest!.headers["Authorization"] = `Bearer ${token}`;
					return api(originalRequest! as AxiosRequestConfig);
				}
			} catch (refreshError) {
				// refresh failed — redirect to login (or clear client state elsewhere)
				try {
					// If it's an Axios error, check status
					const e = refreshError as AxiosError<unknown>;
					if (e.response?.status === 401) {
						window.location.href = "/login";
					}
				} catch (e) {
					console.error("Refresh failed:", e);
					window.location.href = "/login";
				}
			} */
		}

		return Promise.reject(error);
	}
);

export default api;
