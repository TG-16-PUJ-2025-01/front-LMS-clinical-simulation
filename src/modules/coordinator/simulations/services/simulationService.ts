import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import Simulation from "@/modules/core/models/simulation"
import axios from "axios"

export async function getSimulationById(id: number): Promise<ApiResponse<Simulation>> {
	const { data } = await axios.get(`${API_URL}/simulation/${id}`)
	return data
}
