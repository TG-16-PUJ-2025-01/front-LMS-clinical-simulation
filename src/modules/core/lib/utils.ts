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
