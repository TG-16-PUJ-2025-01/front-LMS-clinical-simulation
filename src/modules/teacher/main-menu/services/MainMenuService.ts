import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import Class from "@/modules/core/models/class"
import axios from "axios"

export async function getMenuInfo(year?: number, period?: number): Promise<ApiResponse<Class[]>> {
	const params = new URLSearchParams()
	if (year !== undefined && year !== null) params.append("year", year.toString())
	if (period !== undefined && period !== null) params.append("period", period.toString())

	const url = `${API_URL}/class/all/professor${params.toString() ? `?${params.toString()}` : ""}`
    
	const { data } = await axios.get(url)
	return data
}
