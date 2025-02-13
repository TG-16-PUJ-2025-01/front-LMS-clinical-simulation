import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import Video from "@/modules/core/models/video"
import { API_URL } from "@/modules/core/config/env"
import { VideoOff } from "lucide-react"

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
				{video?.status === "AVAILABLE" ? (
					<video
						className="aspect-video h-full w-full"
						src={`${API_URL}/streaming/video/${video?.name}`}
						controls
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
