import Role from "./role"

export default interface User {
  	id: number
	email: string
	name: string
	lastName: string
	institutionalId: number
	roles: Role[]
	username: string
}