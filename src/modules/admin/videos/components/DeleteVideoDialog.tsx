import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/modules/core/components/ui/alert-dialog"
import { deleteVideo } from "../services/videoService"
import Video from '../../../core/models/video';
import { toast } from "sonner";

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	video?: Video
}

export default function DeleteVideoDialog({ open, onClose, video }: Props) {
	const handleConfirm = async () => {
		try {
			await deleteVideo(video!.videoId)
			toast.success("Video eliminado")
		} catch (error) {
			toast.error("Error al eliminar el video")
		}
		onClose(false)
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar el video?</AlertDialogTitle>
					<AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Continuar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
