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
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { toast } from "sonner"
import { deleteRubricTemplate } from "../services/rubricTemplateService"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateToDelete?: RubricTemplate
}

export default function DeleteRubricTemplateDialog({
	open,
	onClose,
	rubricTemplateToDelete,
}: Props) {
	const handleConfirm = async () => {
		try {
			await deleteRubricTemplate(rubricTemplateToDelete!.rubricTemplateId!)
			onClose(false)
			toast.success("Rúbrica eliminada exitosamente")
		} catch (error) {
			if (
				error instanceof Error &&
				(error as { response?: { status?: number } }).response?.status === 400
			) {
				toast.error("No se puede eliminar la rúbrica porque esta siendo utilizada en cursos")
			} else {
				console.error(error)
				toast.error("Error al eliminar la rúbrica")
			}
		}
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la rúbrica?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y deberá volver a crear dicha rúbrica
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
