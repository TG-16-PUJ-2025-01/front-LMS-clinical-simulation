import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import { userListMapper } from "@/modules/core/mappers/userListMapper"
import Userlist from "@/modules/core/models/userList"
import Class from "@/modules/core/models/class"

const axiosInstance = axios.create({
	baseURL: API_URL,
})

export async function getClasses(page: number, size: number): Promise<ApiResponse<Class[]>> {
    const { data } = await axiosInstance.get("/class/all", {
        params: {
            page,
            size,
        },
    })
    return {
        ...data,
        data: data.data.map(classMapper),
    }
}

export async function getClass(id: number): Promise<ApiResponse<Class>> {
    const { data } = await axiosInstance.get("/class/get", { params: { id } })

    return {
        ...data,
        data: classMapper(data.data),
    }
}

export async function createClass(newClass: Class): Promise<ApiResponse<Class>> {
    const { data } = await axiosInstance.post("/class/add", newClass)
    return {
        ...data,
        data: classMapper(data.data),
    }
}

export async function updateClass(id: number, updatedClass: Class): Promise<ApiResponse<Class>> {
    console.log(updatedClass)
    
    const { data } = await axiosInstance.put( `/class/update/${id}`, updatedClass)
    return {
        ...data,
        data: classMapper(data.data)
    }
}

export async function deleteClass(id: number, ): Promise<ApiResponse<Class>> {
    const { data } = await axiosInstance.delete(`/class/delete/${id}`)

    return {
        ...data,
        data: classMapper(data.data),
    }
}

export async function getAllProfessors(): Promise<ApiResponse<Userlist[]>> {
    const { data } = await axiosInstance.get(`/user/all/professor`)

    return {
        ...data,
        data: data.data.map(userListMapper),
    }
}