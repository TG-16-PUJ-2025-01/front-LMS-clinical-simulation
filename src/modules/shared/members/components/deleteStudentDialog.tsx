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
import { deleteStudentFromClass } from "../services/membersService"
import { toast } from "sonner"
import User from "@/modules/core/models/user"


interface Props {
  open: boolean
  onClose: (open: boolean) => void
  studentToDelete?: User
  classId: number
}

export default function DeleteStudentClassDialog({ open, onClose, studentToDelete, classId }: Props) {
	
	const handleConfirm = async () => {
			try {
				await deleteStudentFromClass(classId, studentToDelete!.id as number)
				onClose(false)
				toast.success("Miembro eliminado de la clase exitosamente")
			} catch (error) {
				toast.error("Error al eliminar el miembro de clase")
			}
	}
	
	
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar el miembro de la clase?</AlertDialogTitle>
					<AlertDialogDescription>
						Con esta acción se desvinculará al usuario de la clase.
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
