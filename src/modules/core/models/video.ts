export default interface Video {
	videoId: number
	name: string
	recordingDate: Date
	expirationDate: Date
	duration: number // in seconds
	size: number // in GB
	available: boolean
}
