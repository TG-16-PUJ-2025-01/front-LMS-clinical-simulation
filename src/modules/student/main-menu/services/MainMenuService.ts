import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import Class from "@/modules/core/models/class"
import axios from "axios"

export async function getStudentMenuInfo(
    year?: number,
    period?: number,
    filter: string = ""
): Promise<ApiResponse<Class[]>> {
    const { data } = await axios.get(`${API_URL}/class/all/student`, {
        params: {
            year,
            period,
            filter,
        },
    })
    return data
}