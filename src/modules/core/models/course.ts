import User from "./user"

export default interface Course {
	courseId?: number
	javerianaId: number
	name: string
	coordinator: User
	semester: number
	program: string
	department: string
	faculty: string
	
}
