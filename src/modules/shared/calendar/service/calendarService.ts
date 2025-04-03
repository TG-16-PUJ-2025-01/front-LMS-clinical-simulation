import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"
import axios from "axios"
import { EventDTO } from "../dto/eventDto"

export async function getEvents(start: string, end: string): Promise<ApiResponse<EventDTO[]>> {
	const { data } = await axios.get(`${API_URL}/calendar`, {
		params: {
			start,
			end,
		},
	})
	return data
}

export async function getAllEvents(start: string, end: string): Promise<ApiResponse<EventDTO[]>> {
	const { data } = await axios.get(`${API_URL}/calendar/all`, {
		params: {
			start,
			end,
		},
	})
	return data
}
