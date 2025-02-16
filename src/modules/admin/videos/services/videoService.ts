import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import Video from "@/modules/core/models/video"
import ApiResponse from "@/modules/core/models/apiResponse"

const axiosInstance = axios.create({
	baseURL: API_URL,
})

interface EditVideo {
	name: string
	expirationDate: Date
}

export async function getVideos(
	page: number,
	size: number,
	filter: string,
	sort: string,
	asc: boolean
): Promise<ApiResponse<Video[]>> {
	const { data } = await axiosInstance.get("/video/all", {
		params: {
			page,
			size,
			sort,
			asc,
			filter,
		},
	})

	return {
		...data,
		data: data.data.map((video: Video) => ({
			...video,
			recordingDate: new Date(video.recordingDate),
			expirationDate: new Date(video.expirationDate),
		})),
	}
}

export async function updateVideo(videoId: number, video: EditVideo): Promise<ApiResponse<Video>> {
	console.log(videoId)

	const { data } = await axiosInstance.put(`/video/${videoId}`, video)

	return {
		...data,
		data: {
			...data.data,
			recordingDate: new Date(data.data.recordingDate),
			expirationDate: new Date(data.data.expirationDate),
		},
	}
}

export async function deleteVideo(videoId: number): Promise<ApiResponse<null>> {
	const { data } = await axiosInstance.delete(`/video/${videoId}`)
	return data
}
