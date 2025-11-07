import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  createdAt: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message: string, type: ToastType, duration = DEFAULT_DURATION) => {
    const id = generateId();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now(),
    };

    set((state) => {
      // Remove oldest toasts if we exceed MAX_TOASTS
      const toasts = [...state.toasts, toast];
      if (toasts.length > MAX_TOASTS) {
        const excess = toasts.length - MAX_TOASTS;
        toasts.splice(0, excess);
      }
      return { toasts };
    });

    if (duration > 0) {
      setTimeout(() => {
        // Only remove if toast still exists
        if (get().toasts.some((t) => t.id === id)) {
          get().removeToast(id);
        }
      }, duration);
    }

    return id;
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),
}));