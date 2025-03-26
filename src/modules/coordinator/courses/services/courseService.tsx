import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import CourseDto from "@/modules/coordinator/courses/dtos/courseDto"
import ApiResponse from "@/modules/core/models/apiResponse"

export async function getCoordinatorCourses(
	searchByKey: string,
	filter: string,
	period: string,
	asc: boolean
): Promise<ApiResponse<CourseDto[]>> {
	const { data } = await axios.get(`${API_URL}/course/all/coordinator`, {
		params: {
			asc,
			filter,
			period,
			searchByKey,
		},
	})

	console.log( "data "+ searchByKey+" " + filter +" "+ asc)
	return {
		...data,
		data: data.data,
	}
}
