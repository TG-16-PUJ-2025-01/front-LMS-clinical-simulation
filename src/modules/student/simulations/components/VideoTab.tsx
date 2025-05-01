import { API_URL } from "@/modules/core/config/env"
import Video from "@/modules/core/models/video"
import { VideoOff } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/modules/core/components/ui/button"
import { formatTimestamp } from "@/modules/core/lib/utils"
import GradeStatus from "@/modules/core/models/gradeStatus"

interface Props {
	video?: Video
	gradeStatus?: GradeStatus
}

export default function VideoTab({ video, gradeStatus }: Props) {
	const videoRef = useRef<HTMLVideoElement>(null)

	return (
		<div>
			{video?.name ? (
				<video
					ref={videoRef}
					src={`${API_URL}/streaming/video/${video?.name}`}
					className="aspect-video w-full rounded-md"
					controls
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
