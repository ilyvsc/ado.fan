import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and conditionally applies CSS class names, then merges
 * conflicting Tailwind CSS classes into a single optimized string.
 *
 * @param inputs - Class values accepted by `clsx`, including strings,
 * arrays, objects, and conditional class expressions.
 * @returns A merged class name string with Tailwind conflicts resolved.
 *
 * @example
 * cn("px-2", "px-4", "text-sm") // => "px-4 text-sm"
 *
 * @example
 * cn("btn", isActive && "btn-active") // => "btn btn-active"
 *
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
