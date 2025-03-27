import { API_URL } from "@/modules/core/config/env"
import axios from "axios"
import RubricTemplateDto from "../dtos/rubricTemplateDto"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import ApiResponse from "@/modules/core/models/apiResponse"
import Course from "@/modules/core/models/course"

export function createRubricTemplate(data: RubricTemplateDto) {
	return axios.post(`${API_URL}/rubric/template`, data)
}

export async function getRubricTemplates(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean,
	archived: boolean = false,
	mine: boolean = false
): Promise<ApiResponse<RubricTemplate[]>> {
	const { data } = await axios.get(`${API_URL}/rubric/template/all`, {
		params: {
			page,
			size,
			filter,
			sort,
			asc,
			archived,
			mine,
		},
	})

	return {
		...data,
		data: data.data.map((rubric: RubricTemplate) => ({
			...rubric,
			creationDate: new Date(rubric.creationDate),
		})),
	}
}

export async function getCoursesByRubricTemplate(rubricTemplateId: number): Promise<ApiResponse<Course[]>> {
	const { data } = await axios.get(`${API_URL}/rubric/template/${rubricTemplateId}/courses`)
	return data
}

export async function updateRubricTemplate(rubricTemplateId: number, data: RubricTemplateDto) {
	return axios.put(`${API_URL}/rubric/template/${rubricTemplateId}`, data)
}

export async function deleteRubricTemplate(rubricTemplateId: number) {
	return axios.delete(`${API_URL}/rubric/template/${rubricTemplateId}`)
}

export async function archiveRubricTemplate(rubricTemplateId: number) {
	return axios.put(`${API_URL}/rubric/template/archive/${rubricTemplateId}`)
}

export async function unarchiveRubricTemplate(rubricTemplateId: number) {
	return axios.put(`${API_URL}/rubric/template/unarchive/${rubricTemplateId}`)
}
