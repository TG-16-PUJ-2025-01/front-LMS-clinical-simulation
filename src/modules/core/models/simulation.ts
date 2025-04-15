import GradeStatus from "./gradeStatus"
import Practice from "./practice"
import Room from "./room"
import Rubric from "./rubric"
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
  practice?: Practice
  rubric?: Rubric
}
