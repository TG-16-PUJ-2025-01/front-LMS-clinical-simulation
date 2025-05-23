import Comment from "./comment"
import Simulation from "./simulation"

export default interface Video {
	videoId: number
	name: string
	recordingDate: Date
	duration: number // in seconds
	size: number // in GB
	available: boolean
	videoUrl: string
	simulation: Simulation
	comments: Comment[]
}
