import axios from "axios"
import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"
import Simulation from "@/modules/core/models/simulation"

export async function getSimulationsByPracticeId(
	practiceId: number,
	page: number,
	size: number
): Promise<ApiResponse<Simulation[]>> {
	const { data } = await axios.get(`${API_URL}/simulation/practice/${practiceId}`, {
		params: {
			page,
			size,
		},
	})
    
	return data
}
