import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import ApiResponse from "@/modules/core/models/apiResponse";
import Class from "@/modules/core/models/class";
import User from "@/modules/core/models/user";
import CreateClassDTO from "../dtos/createClassDTO";

export async function getClasses(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Class[]>> {
	const { data } = await axios.get(`${API_URL}/class/all`, {
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
		data: data.data,
	}
}

export async function getClass(id: number): Promise<ApiResponse<Class>> {
	const { data } = await axios.get(`${API_URL}/class/${id}`)
	return {
		...data,
		data: data.data,
	}
}

export async function createClass(newClass: CreateClassDTO): Promise<ApiResponse<Class>> {
    console.log(newClass)
    const { data } = await axios.post(`${API_URL}/class/add`, newClass)
    return {
        ...data,
        data: data.data,
    }
}

export async function createClassByExcel(newClass: CreateClassDTO): Promise<ApiResponse<Class>> {
    console.log(newClass)
    const { data } = await axios.post(`${API_URL}/class/add/excel`, newClass)
    return {
        ...data,
        data: data.data,
    }
}

export async function updateClass(id: number, updatedClass: CreateClassDTO): Promise<ApiResponse<Class>> {
    console.log(updatedClass)
    
    const { data } = await axios.put( `${API_URL}/class/update/${id}`, updatedClass)
    return {
        ...data,
        data: data.data
    }
}

export async function deleteClass(id: number): Promise<ApiResponse<Class>> {
	const { data } = await axios.delete(`${API_URL}/class/delete/${id}`)

	return {
		...data,
		data: data.data,
	}
}

export async function getAllProfessors(): Promise<ApiResponse<User[]>> {
	const { data } = await axios.get(`${API_URL}/user/all/professor`)

	return {
		...data,
		data: data.data,
	}
}
