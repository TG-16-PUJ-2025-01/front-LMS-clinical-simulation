import ApiResponse from "@/modules/core/models/apiResponse"
import { API_URL } from "@/modules/core/config/env"
import axios from "axios"

export interface Event {
	id: number
	title: string
	start: string
	end: string
}

export async function getEvents(): Promise<ApiResponse<Event[]>> {
	const { data } = await axios.get(`${API_URL}/calendar`)
	console.log("Data inside the getEvents function ", data)
	return data
}
