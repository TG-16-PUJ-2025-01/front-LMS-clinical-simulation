import Class from "./class"
import Type from "./practiceType"
import RubricTemplate from "./rubricTemplate"

export default interface Practice {
	id: number
	name: string
	description: string
	type: Type
	gradeable: boolean
	simulationDuration: number
	numberOfGroups: number | null
	maxStudentsGroup: number | null
	classModel: Class
	rubricTemplate: RubricTemplate | null
}
