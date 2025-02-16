import User from "./user"

export default interface Course {
	id?: number
	idJaveriana: number
	name: string
	coordinator: User
}
