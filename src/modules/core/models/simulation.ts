import Room from "./room"
import Video from "./video"

export default interface Simulation {
	simulationId: number
	startDateTime: Date
	endDateTime: Date
  grade: number
  gradeDate: Date
  video: Video
  rooms: Room[]
}
