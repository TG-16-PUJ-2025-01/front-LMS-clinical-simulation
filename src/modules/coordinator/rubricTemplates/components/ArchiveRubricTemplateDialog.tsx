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
import { archiveRubricTemplate, unarchiveRubricTemplate } from "../services/rubricTemplateService"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateToArchive?: RubricTemplate
}

export default function ArchiveRubricTemplateDialog({
	open,
	onClose,
	rubricTemplateToArchive,
}: Props) {
	const handleConfirm = async () => {
		try {
			if (rubricTemplateToArchive?.archived) {
				await unarchiveRubricTemplate(rubricTemplateToArchive!.rubricTemplateId!)
				toast.success("Rubrica desarchivada correctamente")
			} else {
				await archiveRubricTemplate(rubricTemplateToArchive!.rubricTemplateId!)
				toast.success("Rubrica archivada correctamente")
			}
			onClose(false)
		} catch (error) {
			console.error(error)

			if (rubricTemplateToArchive?.archived) {
				toast.error("Error al desarchivar la rubrica")
			} else {
				toast.error("Error al archivar la rubrica")
			}
		}
	}

	return (
		<AlertDialog open={open}>
			{rubricTemplateToArchive?.archived ? (
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Seguro que desea desarchivar la rubrica?</AlertDialogTitle>
						<AlertDialogDescription>
							Puede volver a archivar la rubrica en cualquier momento
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
						<AlertDialogAction variant="default" onClick={handleConfirm}>
							Desarchivar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			) : (
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Seguro que desea archivar la rubrica?</AlertDialogTitle>
						<AlertDialogDescription>
							Solo será visible por usted y por los administradores, puede desarchivarla en
							cualquier momento
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => onClose(false)}>Cancelar</AlertDialogCancel>
						<AlertDialogAction variant="default" onClick={handleConfirm}>
							Archivar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			)}
		</AlertDialog>
	)
}
