import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"
import axios from "axios"
import { EventDTO } from "../dto/eventDto"

export async function getEvents(): Promise<ApiResponse<EventDTO[]>> {
	const { data } = await axios.get(`${API_URL}/calendar`)
	return data
}

export async function getAllEvents(): Promise<ApiResponse<EventDTO[]>> {
	const { data } = await axios.get(`${API_URL}/calendar/all`)
	return data
}
