import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import GroupsDataTable from "./GroupsDataTable"

interface ViewGroupsDialog {
	open: boolean
	onClose: () => void
	practiceId: number
}

export default function ViewGroupsDialog({ open, onClose, practiceId }: ViewGroupsDialog) {
	const handleEnroll = (simulationId: number) => {
		toast.success(`Inscrito en el grupo ${simulationId}`)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Grupos Disponibles a Inscripción</DialogTitle>
					<DialogDescription>
						Los siguientes son los horarios establecidos por el profesor, por favor inscribase a uno
						de ellos.
					</DialogDescription>
				</DialogHeader>
				<GroupsDataTable practiceId={practiceId} onEnroll={handleEnroll} />
			</DialogContent>
		</Dialog>
	)
}
