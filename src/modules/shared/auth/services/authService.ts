import { API_URL } from "@/modules/core/config/env"
import { setToken } from "@/modules/core/lib/tokenHandler"
import Role from "@/modules/core/models/role"
import axios from "axios"
import { LoginResponseDto } from "../dtos/loginResponseDto"
import ApiResponse from "@/modules/core/models/apiResponse"

interface LoginData {
	email: string
	password: string
}

interface ChangePasswordData {
	password: string
	newPassword: string
}

export const login = async (email: string, password: string): Promise<Role[]> => {
	try {
		const loginData: LoginData = { email, password }
		const { data } = await axios.post<ApiResponse<LoginResponseDto>>(
			`${API_URL}/auth/login`,
			loginData
		)
		setToken(data.data.token)
		return data.data.roles.map((role) => Role[role as keyof typeof Role])
	} catch (error) {
		console.error("Error durante el login:", error)
		throw new Error("Error durante el login")
	}
}

export const changePassword = async (password: string, newPassword: string) => {
	try {
		const changePasswordData: ChangePasswordData = { password, newPassword }
		const response = await axios.post<string>(`${API_URL}/auth/change-password`, changePasswordData)
		setToken(response.data.toString())
	} catch (error) {
		console.error("Error al cambiar la contraseña:", error)
		throw new Error("Error al cambiar la contraseña")
	}
}

export const isValidToken = async (): Promise<boolean> => {
	try {
		await axios.get(`${API_URL}/auth/validate-token`)
		return true
	} catch (error) {
		console.error("Error al validar el token:", error)
		return false
	}
}

export const getRolesByToken = async (): Promise<Role[]> => {
	try {
		const response = await axios.get<{ data: string[] }>(`${API_URL}/auth/roles`)
		return response.data.data.map((role) => Role[role as keyof typeof Role]) // Devuelve los roles
	} catch (error) {
		console.error("Error al obtener los roles:", error)
		throw new Error("Error al obtener los roles")
	}
}

export const getEmailByToken = async (): Promise<string> => {
	try {
		const response = await axios.get<{ data: string }>(`${API_URL}/auth/email`)
		return response.data.data // Devuelve el email
	} catch (error) {
		console.error("Error al obtener el email:", error)
		throw new Error("Error al obtener el email")
	}
}

export const getNameByToken = async (): Promise<string> => {
	try {
		const response = await axios.get<{ data: string }>(`${API_URL}/auth/name`)
		return response.data.data // Devuelve el nombre
	} catch (error) {
		console.error("Error al obtener el nombre:", error)
		throw new Error("Error al obtener el nombre")
	}
}
