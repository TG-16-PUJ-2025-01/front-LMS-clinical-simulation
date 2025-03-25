import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import axios from "axios"

export async function getMenuInfo(): Promise<ApiResponse<any>> {
    const { data } = await axios.get(`${API_URL}/class/all/professor`)
    return data
}