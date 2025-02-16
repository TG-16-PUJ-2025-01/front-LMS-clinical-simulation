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
		if (!roomId){
			toast.error("No se ha proporcionado un ID de sala para eliminar.");
			return;
		} 

		try {
			await deleteRoom(roomId);
			console.log(`Sala con ID ${roomId} eliminada exitosamente.`);
			toast.success("Sala eliminada exitosamente.");
			onClose(false);
		} catch (error) {
			console.error("Error al eliminar la sala:", error);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la sala?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction className="danger bg-red-600" onClick={onConfirmDelete}>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
