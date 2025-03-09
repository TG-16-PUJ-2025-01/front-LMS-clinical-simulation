import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import User from "@/modules/core/models/user"
import Class from "@/modules/core/models/class"

export async function getClassMembers(
    page: number,
    size: number,
    filter: string,
    sort: string,
    asc: boolean,
    classId: number
): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/class/${classId}/member/all`, {
        params: {
            page,
            size,
            filter,
            sort,
            asc,
        },
    })
    return {
        ...data,
        data: (data.data),
    }
}

export async function getAllUsers(): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/member/all`)

    return {
        ...data,
        data: (data.data),
    }
}

export async function getStudentsNotInClass(classId: number, filter: string): Promise<ApiResponse<User[]>> {
    const { data } = await axios.get(`${API_URL}/class/${classId}/member/all/outside`, {
        params: {
            filter,
        },
    })

    return {
        ...data,
        data: (data.data),
    }
}

export async function deleteStudentFromClass(classId: number, studentId: number): Promise<ApiResponse<User>> {
    const { data } = await axios.delete(`${API_URL}/class/delete/${classId}/member/${studentId}`)

    return {
        ...data,
        data: (data.data),
    }
}

export async function updateClassMembers(classId: number, selectecMembers: User[]): Promise<Class> {
    const { data } = await axios.put(`${API_URL}/class/update/${classId}/members`, selectecMembers)

    return {
        ...data,
        data: (data.data),
    }
}
