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
import { deleteClass } from "../services/classService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classId: number | null
}

export default function DeleteClassDialog({ open, onClose, classId }: Props) {
	const handleConfirm = async () => {
		try {
			if (!classId) {
				toast.error("No se ha proporcionado un ID de clase para eliminar.")
				return
			}
			await deleteClass(classId)
			onClose(false)
			toast.success("Clase eliminada exitosamente")
		} catch (error) {
			console.error(error)
			toast.error("Error al eliminar la clase")
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán toda la información vinculada a dicha
						clase.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Eliminar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
