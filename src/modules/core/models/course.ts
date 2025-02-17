import User from "./user"

export default interface Course {
	id?: number
	javerianaId: number
	name: string
	coordinator: User
}
