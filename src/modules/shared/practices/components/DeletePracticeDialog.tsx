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
import { deletePractice } from "../services/PracticeService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	practiceId: number | null
}

export default function DeletePracticeDialog({ open, onClose, practiceId }: Props) {
	async function onConfirmDelete (){
        if (!practiceId) {
            toast.error("No se ha proporcionado un ID de práctica para eliminar.")
            return
        }
		try {
			await deletePractice(practiceId)
			onClose(false)
			toast.success("Práctica eliminada exitosamente.")
		} catch (error) {
			console.error(error)
			toast.error("Error al eliminar la práctica")
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la práctica?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán toda la información vinculada a dicha
						práctica.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
					<AlertDialogAction className="danger" onClick={onConfirmDelete}>Eliminar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
