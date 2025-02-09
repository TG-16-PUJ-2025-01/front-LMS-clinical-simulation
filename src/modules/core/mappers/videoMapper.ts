import Video from "@/modules/core/models/video"

export function videoMapper(video): Video {
	return {
		name: video.videoName,
		recordingDate: new Date(video.date),
		expirationDate: new Date(video.videoExpirationDate),
		duration: video.videoDuration,
		size: video.videoSize,
	}
}
