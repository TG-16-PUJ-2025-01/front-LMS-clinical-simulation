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


interface Props {
  open: boolean
  onClose: (open: boolean) => void
  rubricTemplateToDelete?: RubricTemplate
}

export default function DeleteRubricTemplateDialog({ open, onClose, rubricTemplateToDelete }: Props) {
	
	const handleConfirm = async () => {
			try {
				//await deleteRubricTemplate(rubricTemplateToDelete!.rubricTemplateId)
				onClose(false)
				toast.success("Rubrica eliminada correctamente")
			} catch (error) {
				toast.error("Error al eliminar la rubrica")
			}
	}
	
	
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Seguro que desea eliminar la rubrica?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no es reversible y debera volver a crear dicha rubrica
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
