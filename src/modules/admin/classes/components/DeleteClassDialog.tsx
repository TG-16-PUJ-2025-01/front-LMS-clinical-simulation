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
import Class from "@/modules/core/models/class"
import { deleteClass } from "../services/classService"
import { toast } from "sonner"


interface Props {
  open: boolean
  onClose: (open: boolean) => void
  classToDelete?: Class
}

export default function DeleteClassDialog({ open, onClose, classToDelete }: Props) {
	
	const handleConfirm = async () => {
			try {
				await deleteClass(classToDelete!.classId)
				onClose(false)
				toast.success("Asignatura eliminada correctamente")
			} catch (error) {
				toast.error("Error al eliminar la asignatura")
			}
	}
	
	
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán toda la información vinculada a dicha clase.
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
