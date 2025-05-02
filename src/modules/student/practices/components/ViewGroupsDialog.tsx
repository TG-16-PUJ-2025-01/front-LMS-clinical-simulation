import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import GroupsDataTable from "./GroupsDataTable"
import { joinSimulation } from "../services/practicesService"

interface ViewGroupsDialog {
	open: boolean
	onClose: () => void
	practiceId: number
	maxNumStudentsPerGroup: number
}

export default function ViewGroupsDialog({ open, onClose, practiceId, maxNumStudentsPerGroup }: ViewGroupsDialog) {
	const handleEnroll = async (simulationId: number) => {
		try {
			await joinSimulation(simulationId)
			toast.success(`Inscrito en el grupo ${simulationId}`)
		} catch (error) {
			toast.error("Error al inscribirse en el grupo")
			console.error(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Horarios Disponibles a Inscripción</DialogTitle>
					<DialogDescription>
						A continuación, se presentan los horarios asignados por el profesor. Por favor,
						inscríbete en uno de ellos. Si un grupo aparece como "No disponible", esto significa que ya no
						hay cupos o que la simulación ya fue realizada.
					</DialogDescription>
				</DialogHeader>
				<GroupsDataTable practiceId={practiceId} onEnroll={handleEnroll} maxNumStudentsPerGroup={maxNumStudentsPerGroup} />
			</DialogContent>
		</Dialog>
	)
}
