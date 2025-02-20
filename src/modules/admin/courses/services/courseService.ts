import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import Course from "@/modules/core/models/course"
import ApiResponse from "@/modules/core/models/apiResponse"
import User from "@/modules/core/models/user"
import EditCourseDTO from "../dtos/editCourseDTO"
import CreateCourseDTO from "../dtos/createCourseDTO"

const axiosInstance = axios.create({
	baseURL: API_URL,
})

export async function getCourses(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Course[]>> {
	const { data } = await axiosInstance.get("/course/all", {
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

export async function getCourse(id: number): Promise<ApiResponse<Course>> {
	const { data } = await axiosInstance.get("/course/get", { params: { id } })

	return {
		...data,
		data: data.data,
	}
}

export async function createCourse(newCourse: CreateCourseDTO): Promise<ApiResponse<Course>> {
	const { data } = await axiosInstance.post("/course/add", newCourse)
	return {
		...data,
		data: data.data,
	}
}

export async function updateCourse(
	id: number,
	updatedCourse: EditCourseDTO
): Promise<ApiResponse<Course>> {
	const { data } = await axiosInstance.put(`/course/update/${id}`, updatedCourse)
	return {
		...data,
		data: data.data,
	}
}

export async function deleteCourse(id: number): Promise<ApiResponse<Course>> {
	const { data } = await axiosInstance.delete(`/course/delete/${id}`)

	return {
		...data,
		data: data.data,
	}
}

export async function getAllCoordinators(): Promise<ApiResponse<User[]>> {
	const { data } = await axiosInstance.get(`/user/all/coordinator`)

	return {
		...data,
		data: data.data,
	}
}
