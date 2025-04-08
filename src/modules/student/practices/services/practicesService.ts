import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import axios from "axios"

export async function joinSimulation(simulationId: number): Promise<ApiResponse<null>> {
    const {data} = await axios.post(`${API_URL}/simulation/${simulationId}/join`)
    return data
}

export async function getEnroledSimulationId(practiceId: number): Promise<ApiResponse<number>> {
    const {data} = await axios.get(`${API_URL}/practice/${practiceId}/enrolled`)
    return data
}