import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS optimization
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 