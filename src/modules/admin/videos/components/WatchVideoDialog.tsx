import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import Video from "@/modules/core/models/video"
import { API_URL } from "@/modules/core/config/env"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	video?: Video
}

export default function WatchVideoDialog({ open, onClose, video }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Ver Video</DialogTitle>
					<DialogDescription>Estás viendo el video {video?.name}</DialogDescription>
					<video src={`${API_URL}/streaming/video/${video?.name}`} controls></video>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
