import axios from "axios"
import Practice from "@/modules/core/models/practice"
import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"

export async function getAllPractices(
    page: number,
    size: number,
    filter: string,
    sort: string,
    asc: boolean
): Promise<ApiResponse<Practice[]>> {
    const { data } = await axios.get(`${API_URL}/practice/all`, {
        params: {
            page,
            size,
            sort,
            asc,
            filter,
        },
    })

    return data
}

export async function getPracticeById(id: number): Promise<ApiResponse<Practice>> {
    const { data } = await axios.get(`${API_URL}/practice/${id}`)
    return data
}

export async function getPracticeByClassId(id: number): Promise<ApiResponse<Practice>> {
    const { data } = await axios.get(`${API_URL}/practice/class/${id}`)
    return data
}

export async function updatePractice(id: number, practice: Practice): Promise<ApiResponse<Practice>> {
    const { data } = await axios.put(`${API_URL}/practice/update/${id}`, practice)
    return data
}

export async function deletePractice(id: number): Promise<ApiResponse<null>> {
    const { data } = await axios.delete(`${API_URL}/practice/delete/${id}`)
    return data
}

export async function createPractice(classId: number, practice: Practice): Promise<ApiResponse<Practice>> {
    const { data } = await axios.post(`${API_URL}/practice/add/${classId}`, practice)
    return data
}