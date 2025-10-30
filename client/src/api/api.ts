import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./axios";
import useAdminStore from "../stores/admin.stores";
import { useToastStore } from "../stores/toast.store";
import type { LoginRequest, LoginResponse } from "../stores/admin.stores";

type MutationPayload = Record<string, unknown> | FormData;

const usePostInfo = (url: string) => {
	return useMutation({
		mutationFn: (data: MutationPayload) => {
			// If caller provided a FormData (file upload), send as multipart/form-data
			// Let the browser set the Content-Type (including boundary) for FormData.
			// Setting Content-Type manually prevents the boundary from being added.
			return api.post(url, data as unknown);
		},
		onSuccess: (data) => {
			console.log("Info sent successfully:", data);
			useToastStore.getState().addToast("Info sent successfully", "success");
		},
		onError: (error: unknown) => {
			console.error("Error sending info:", error);
			const axiosError = error as { response?: { data?: { error?: string; message?: string }; }; message?: string };
			const errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message || "Error sending info";
			useToastStore.getState().addToast(errorMessage, "error");
		},
	});
};

const useGetInfo = <T>(url: string) => {
	return useQuery<T>({
		queryKey: [url],
		queryFn: async () => {
			const res = await api.get<T>(url);
			return res.data;
		},
	});
};

const LoginUser = (url: string) => {
	const login = useAdminStore((state) => state.login);

	return useMutation({
		mutationFn: (data: LoginRequest) => api.post<LoginResponse>(url, data),
		onSuccess: (response) => {
			console.log("Login response:", response);

			const { user, token } = response.data;

			if (!user || !token) {
				console.error("Invalid login response:", response.data);
				return;
			}

			login(response.data);
			console.log("Login successful");
		},
		onError: (error) => {
			console.error("Login failed:", error);
		},
	});
};

const LogoutUser = (url: string) => {
	const logout = useAdminStore((state) => state.logout);

	return useQuery({
		queryKey: [url],
		queryFn: async () => {
			try {
				const res = await api.get(url);
				logout();
				return res.data;
			} catch (err: unknown) {
				console.error(err, "error in logging out");
			}
		},
	});
};

export { usePostInfo, useGetInfo, LoginUser, LogoutUser };
