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
import User from "@/modules/core/models/user"


interface Props {
  open: boolean
  onClose: (open: boolean) => void
  studentToDelete?: User
}

export default function DeleteStudentClassDialog({ open, onClose, studentToDelete }: Props) {
	
	const handleConfirm = async () => {
			try {
				await deleteClass(studentToDelete!.id as number)
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
					<AlertDialogTitle>¿Seguro que desea eliminar el estudiante de la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Con esta acción se desvinculará al estudiante de la clase.
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
