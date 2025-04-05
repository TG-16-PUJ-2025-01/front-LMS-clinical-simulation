import Practice from "./practice"
import Room from "./room"
import Video from "./video"

export default interface Simulation {
  groupNumber: number
	simulationId: number
	startDateTime: Date
	endDateTime: Date
  grade: number
  gradeDate: Date
  video: Video
  rooms: Room[]
  practice: Practice
}
