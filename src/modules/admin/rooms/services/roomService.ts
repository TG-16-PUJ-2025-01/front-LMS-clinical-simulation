import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import Room from "@/modules/core/models/room"
import ApiResponse from "@/modules/core/models/apiResponse"
import RoomType from "@/modules/core/models/roomType"

const axiosInstance = axios.create({
	baseURL: API_URL,
})

export async function getAllRooms(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Room[]>> {
	const { data } = await axiosInstance.get(`/rooms/all`, {
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
	const { data } = await axiosInstance.get(`/rooms/${id}`)
	return data
}

export async function getRoomsTypes(): Promise<ApiResponse<RoomType[]>> {
	const { data } = await axiosInstance.get(`/rooms/types`)
	return data
}

export async function updateRoom(room: Room): Promise<ApiResponse<Room>> {
	const { data } = await axiosInstance.put(`/rooms/update`, room)
	return data
}

export async function deleteRoom(id: number): Promise<ApiResponse<null>> {
	const { data } = await axiosInstance.delete(`/rooms/delete/${id}`)
	return data
}

export async function createRoom(room: Room): Promise<ApiResponse<Room>> {
	const { data } = await axiosInstance.post(`/rooms/add`, room)
	return data
}

export async function addRoomType(name: string): Promise<ApiResponse<RoomType>> {
	const { data } = await axiosInstance.post(`/rooms/type/add`, { name })
	return data
}
