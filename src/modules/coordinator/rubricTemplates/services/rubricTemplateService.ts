import { API_URL } from "@/modules/core/config/env"
import axios from "axios"
import RubricTemplateDto from "../dtos/rubricTemplateDto"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import ApiResponse from "@/modules/core/models/apiResponse"

export function createRubricTemplate(data: RubricTemplateDto) {
	return axios.post(`${API_URL}/rubric/template`, data)
}

export async function getRubricTemplates(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean,
	archived: boolean = true,
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
