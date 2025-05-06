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
				toast.success("Rúbrica desarchivada exitosamente")
			} else {
				await archiveRubricTemplate(rubricTemplateToArchive!.rubricTemplateId!)
				toast.success("Rúbrica archivada exitosamente")
			}
			onClose(false)
		} catch (error) {
			console.error(error)

			if (rubricTemplateToArchive?.archived) {
				toast.error("Error al desarchivar la rúbrica")
			} else {
				toast.error("Error al archivar la rúbrica")
			}
		}
	}

	return (
		<AlertDialog open={open}>
			{rubricTemplateToArchive?.archived ? (
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Seguro que desea desarchivar la rúbrica?</AlertDialogTitle>
						<AlertDialogDescription>
							Puede volver a archivar la rúbrica en cualquier momento
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
						<AlertDialogTitle>¿Seguro que desea archivar la rúbrica?</AlertDialogTitle>
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
