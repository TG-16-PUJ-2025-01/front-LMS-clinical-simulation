import Video from "@/modules/core/models/video"
import { VideoOff } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/modules/core/components/ui/button"
import { formatTimestamp } from "@/modules/core/lib/utils"
import GradeStatus from "@/modules/core/models/gradeStatus"
import { setVideoAsUnavailable } from "@/modules/admin/videos/services/videoService"

interface Props {
	video?: Video
	gradeStatus?: GradeStatus
	sync?: () => void
}

export default function VideoTab({ video, gradeStatus, sync }: Props) {
	const videoRef = useRef<HTMLVideoElement>(null)

	return (
		<div>
			{video?.name ? (
				<video
					ref={videoRef}
					src={video?.videoUrl}
					className="aspect-video w-full rounded-md"
					controls
					onError={(e) => {
						const videoElement = e.currentTarget;
						if (videoElement.error?.code === MediaError.MEDIA_ERR_NETWORK) {
							console.error("Network error occurred while loading the video.");
						} else if (videoElement.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
							console.error("The video source is not supported or a 404 error occurred.");
							setVideoAsUnavailable(video?.videoId ?? 0)
							sync?.()
						} else {
							console.error("An unknown error occurred while loading the video.");
						}
					}}
				></video>
			) : (
				<div className="flex aspect-video w-full flex-col items-center justify-center gap-6">
					<p>El video no está disponible para su visualización</p>
					<VideoOff size={64} />
					<div className="h-6"></div>
				</div>
			)}
			<h2 className="my-2 font-semibold">Comentarios del evaluador</h2>
			{video?.comments.length === 0 ||
			gradeStatus !== GradeStatus.REGISTERED ? (
				<p className="text-sm text-gray-400">No hay comentarios</p>
			) : (
				<ul>
					{video?.comments.map((comment) => (
						<li key={comment.timestamp} className="flex items-baseline gap-2">
							<Button
								type="button"
								variant="link"
								className="h-fit w-14 cursor-pointer p-0 pb-2 text-xs text-gray-400"
								onClick={() => {
									if (videoRef.current) videoRef.current.currentTime = comment.timestamp
								}}
							>
								{formatTimestamp(comment.timestamp)}
							</Button>
							<div className="flex flex-col self-stretch">
								<div className="h-full flex-grow border-l border-gray-400"></div>
							</div>
							<p className="text-sm">{comment.message}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
