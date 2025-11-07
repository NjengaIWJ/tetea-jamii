import { AxiosError } from 'axios';
import { useToastStore } from '../stores/toast.store';


interface ApiErrorResponse {
  error?: string;
  message?: string;
  errors?: { [key: string]: string[] };
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return (
    axiosError.response?.data?.error ||
    axiosError.response?.data?.message ||
    axiosError.message ||
    'An unknown error occurred'
  );
};

export const showErrorToast = (error: unknown): void => {
  const message = handleApiError(error);
  useToastStore.getState().addToast(message, 'error');
};