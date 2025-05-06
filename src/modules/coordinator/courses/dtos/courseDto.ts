import Class from "@/modules/core/models/class"

export default interface CourseDTO {
    courseId: number
    javerianalId: number
	name: string
	coordinatorId: number
    classes: Class[]
}
