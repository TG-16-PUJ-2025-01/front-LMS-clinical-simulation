import axios from "axios"
import Room from "@/modules/core/models/room"
import ApiResponse from "@/modules/core/models/apiResponse"
import RoomType from "@/modules/core/models/roomType"
import { API_URL } from "@/modules/core/config/env"

export async function getAllRooms(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Room[]>> {
	const { data } = await axios.get(`${API_URL}/room/all`, {
		params: {
			page,
			size,
			sort,
			asc,
			filter,
		},
	})

	return data
}

export async function getRoomById(id: number): Promise<ApiResponse<Room>> {
	const { data } = await axios.get(`${API_URL}/room/${id}`)
	return data
}

export async function getRoomsTypes(): Promise<ApiResponse<RoomType[]>> {
	const { data } = await axios.get(`${API_URL}/room/types`)
	return data
}

export async function updateRoom(room: Room): Promise<ApiResponse<Room>> {
	const { data } = await axios.put(`${API_URL}/room/update`, room)
	return data
}

export async function deleteRoom(id: number): Promise<ApiResponse<null>> {
	const { data } = await axios.delete(`${API_URL}/room/${id}`)
	return data
}

export async function createRoom(room: Room): Promise<ApiResponse<Room>> {
	const { data } = await axios.post(`${API_URL}/room/add`, room)
	return data
}

export async function addRoomType(name: string): Promise<ApiResponse<RoomType>> {
	const { data } = await axios.post(`${API_URL}/room/type/add`, { name })
	return data
}
