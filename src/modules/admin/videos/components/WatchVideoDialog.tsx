import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import Video from "@/modules/core/models/video"
import { VideoOff } from "lucide-react"
import { setVideoAsUnavailable } from "../services/videoService"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	video?: Video
}

export default function WatchVideoDialog({ open, onClose, video }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Ver Video</DialogTitle>
					<DialogDescription>Estás viendo el video {video?.name}</DialogDescription>
				</DialogHeader>
				{video?.available ? (
					<video
						className="aspect-video h-full w-full rounded-md"
						src={video?.videoUrl}
						controls
						onError={(e) => {
							const videoElement = e.currentTarget
							if (videoElement.error?.code === MediaError.MEDIA_ERR_NETWORK) {
								console.error("Network error occurred while loading the video.")
							} else if (videoElement.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
								console.error("The video source is not supported or a 404 error occurred.")
								setVideoAsUnavailable(video?.videoId ?? 0)
							} else {
								console.error("An unknown error occurred while loading the video.")
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
			</DialogContent>
		</Dialog>
	)
}
