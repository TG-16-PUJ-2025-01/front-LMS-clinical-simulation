import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import Video from "@/modules/core/models/video"
import { videoMapper } from "@/modules/core/mappers/videoMapper"
import ApiResponse from "@/modules/core/models/apiResponse"

const axiosInstance = axios.create({
	baseURL: API_URL,
})

export async function getVideos(page: number, size: number): Promise<ApiResponse<Video[]>> {
	const { data } = await axiosInstance.get("/simulation/all", {
		params: {
			page,
			size,
		},
	})
	return {
		...data,
		data: data.data.map(videoMapper),
	}
}
