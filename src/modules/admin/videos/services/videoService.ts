import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import Video from "@/modules/core/models/video"
import ApiResponse from "@/modules/core/models/apiResponse"

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
	const { data } = await axios.get(`${API_URL}/video/all`, {
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
	const { data } = await axios.put(`${API_URL}/video/${videoId}`, video)

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
	const { data } = await axios.delete(`${API_URL}/video/${videoId}`)
	return data
}
