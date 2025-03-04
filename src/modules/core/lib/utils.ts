import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number) {
	if (seconds < 60) return `${seconds}s` // Less than a minute

	const minutes = Math.floor(seconds / 60)

	if (minutes < 60) return `${minutes}min` // Less than an hour

	const hours = Math.floor(minutes / 60)
	const min = minutes % 60

	return min ? `${hours}h ${min}min` : `${hours}h`
}

export function formatSize(megaBytes: number) {
	if (megaBytes < 1024) return `${megaBytes}MB` // Less than a gigabyte

	const gigaBytes = megaBytes / 1024

	return `${gigaBytes.toFixed(2)}GB`
}

export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
