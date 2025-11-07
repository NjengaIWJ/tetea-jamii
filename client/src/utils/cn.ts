import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes with proper specificity and order.
 * Uses clsx for conditional class application and tailwind-merge for resolving conflicts.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));