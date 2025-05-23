import Comment from "./comment"

export default interface Video {
	videoId: number
	name: string
	recordingDate: Date
	duration: number // in seconds
	size: number // in GB
	available: boolean
	videoUrl: string
	comments: Comment[]
}
