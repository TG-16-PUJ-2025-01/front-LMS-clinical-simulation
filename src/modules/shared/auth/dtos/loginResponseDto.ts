export interface LoginResponseDto {
	token: string
	roles: string[]
	preferredRole?: string
}
