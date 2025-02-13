export default interface Video {
	name: string
	recordingDate: Date
	expirationDate: Date
	duration: number // in seconds
	size: number // in GB
	status: "AVAILABLE" | "UNAVAILABLE"
}
