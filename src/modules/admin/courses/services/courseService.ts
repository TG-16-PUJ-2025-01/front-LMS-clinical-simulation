import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import Course from "@/modules/core/models/course";
import ApiResponse from "@/modules/core/models/apiResponse";
import User from "@/modules/core/models/user";
import EditCourseDTO from "../dtos/editCourseDTO";
import CreateCourseDTO from "../dtos/createCourseDTO";

export async function getCourses(
  page: number,
  size: number,
  filter: string,
  sort: string,
  asc: boolean
): Promise<ApiResponse<Course[]>> {
	const { data } = await axios.get(`${API_URL}/course/all`, {
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
	const { data } = await axios.get(`${API_URL}/course/get`, { params: { id } })

	return {
		...data,
		data: data.data,
	}
}

export async function createCourse(newCourse: CreateCourseDTO): Promise<ApiResponse<Course>> {
	const { data } = await axios.post(`${API_URL}/course/add`, newCourse)
	return {
		...data,
		data: data.data,
	}
}

export async function updateCourse(
  id: number,
  updatedCourse: EditCourseDTO
): Promise<ApiResponse<Course>> {

	console.log("updatedCourse", updatedCourse)

	
	const { data } = await axios.put(`${API_URL}/course/update/${id}`, updatedCourse)
	return {
		...data,
		data: data.data,
	}
}

export async function deleteCourse(id: number): Promise<ApiResponse<Course>> {
	const { data } = await axios.delete(`${API_URL}/course/delete/${id}`)

	return {
		...data,
		data: data.data,
	}
}

export async function getAllCoordinators(): Promise<ApiResponse<User[]>> {
	const { data } = await axios.get(`${API_URL}/user/all/coordinator`)

	return {
		...data,
		data: data.data,
	}
}
