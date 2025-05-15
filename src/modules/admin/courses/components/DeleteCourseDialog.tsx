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
import Course from "@/modules/core/models/course"
import { deleteCourse } from "../services/courseService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	course?: Course
}

export default function DeleteCourseDialog({ open, onClose, course }: Props) {
	const handleConfirm = async () => {
		try {
			await deleteCourse(course!.courseId as number)
			onClose(false)
			toast.success("Asignatura eliminada exitosamente")
		} catch (error: any) {
			if (error?.response?.status === 409) {
				toast.error(
					"No se puede eliminar la asignatura porque tiene clases asociadas. Elimine primero las clases vinculadas manualmente."
				)
			} else {
				toast.error("Error al eliminar la asignatura")
			}
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la asignatura?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y se eliminarán todas las clases vinculadas a esta asignatura.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Eliminar</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
};
