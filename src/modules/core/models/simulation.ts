import GradeStatus from "./gradeStatus"
import Room from "./room"
import Video from "./video"

export default interface Simulation {
	simulationId: number
	startDateTime: Date
	endDateTime: Date
  grade: number
  gradeStatus: GradeStatus
  gradeDate: Date
  groupNumber: number
  video: Video
  rooms: Room[]
}
