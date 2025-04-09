import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import Simulation from "@/modules/core/models/simulation"
import axios from "axios"

export async function joinSimulation(simulationId: number): Promise<ApiResponse<null>> {
	const { data } = await axios.post(`${API_URL}/simulation/${simulationId}/join`)
	return data
}

export async function getEnroledSimulationId(practiceId: number): Promise<ApiResponse<number>> {
	const { data } = await axios.get(`${API_URL}/practice/${practiceId}/enrolled`)
	return data
}

export async function getSimulationsAvailableByPracticeId(
	practiceId: number,
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Simulation[]>> {
	const { data } = await axios.get(`${API_URL}/simulation/practice/${practiceId}/available`, {
		params: {
			page,
			size,
			sort,
			asc,
			groupNumber: filter ? parseInt(filter) : undefined,
		},
	})

	return data
}
