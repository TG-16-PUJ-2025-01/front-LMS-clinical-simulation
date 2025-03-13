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
import { deleteRoom } from "../services/roomService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	roomId: number | null
}

export default function DeleteRoomDialog({ open, onClose, roomId }: Props) {
	async function onConfirmDelete() {
		if (!roomId) {
			toast.error("No se ha proporcionado un ID de sala para eliminar.")
			return
		}

		try {
			await deleteRoom(roomId)
			toast.success("Sala eliminada exitosamente.")
			onClose(false)
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.message) {
				toast.error(error.response.data.message)
			} else{
				toast.error("Error al eliminar la sala")
			}	
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la sala?</AlertDialogTitle>
					<AlertDialogDescription>Esta acción no es reversible.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
					<AlertDialogAction className="danger" onClick={onConfirmDelete}>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
