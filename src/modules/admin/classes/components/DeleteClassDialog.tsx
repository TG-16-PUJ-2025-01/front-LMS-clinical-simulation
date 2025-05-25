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
		} catch (error: any) {
			if (error?.response?.status === 409) {
				toast.error(
					"No se puede eliminar la clase porque tiene prácticas asociadas. Elimine primero las prácticas vinculadas manualmente."
				)
			} else {
				toast.error("Error al eliminar la clase")
			}
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán todas las prácticas vinculadas a esta clase.
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
