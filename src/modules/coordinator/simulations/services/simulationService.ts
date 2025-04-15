import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import Simulation from "@/modules/core/models/simulation"
import axios from "axios"
import RubricDto from "../dtos/rubricDto"

export async function getSimulationById(id: number): Promise<ApiResponse<Simulation>> {
	const { data } = await axios.get(`${API_URL}/simulation/${id}`)
	return data
}

export async function updateSimulationRubric(
	id: number,
	rubric: RubricDto
): Promise<ApiResponse<Simulation>> {
	const { data } = await axios.put(`${API_URL}/simulation/${id}/rubric`, rubric)
	return data
}

export async function publishSimulationGrade(
	id: number
): Promise<ApiResponse<Simulation>> {
	const { data } = await axios.put(`${API_URL}/simulation/${id}/publish`)
	return data
}
