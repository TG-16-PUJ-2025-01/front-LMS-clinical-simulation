import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import GroupsDataTable from "./GroupsDataTable"
import { joinSimulation, leaveSimulation } from "../services/practicesService"

interface ViewGroupsDialog {
	open: boolean
	onClose: () => void
	practiceId: number
	maxNumStudentsPerGroup: number
}

export default function ViewGroupsDialog({ open, onClose, practiceId, maxNumStudentsPerGroup }: ViewGroupsDialog) {
	const handleEnroll = async (simulationId: number, groupNumber: number) => {
		try {
			await joinSimulation(simulationId)
			toast.success(`Inscrito en el grupo ${groupNumber}`)
		} catch (error) {
			toast.error("Error al inscribirse en el grupo")
			console.error(error)
		}
	}

	const handleLeave = async (simulationId: number, groupNumber: number) => {
		try {
			await leaveSimulation(simulationId)
			toast.success(`Has salido del grupo ${groupNumber}`)
		} catch (error: any) {
			if (error?.response?.status === 409) {
				toast.error("No puedes salir del grupo porque ya se ha realizado la simulación, está en progreso o ya ha sido calificada")
			} else {
				toast.error("Error al salir del grupo")
			}
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
				<GroupsDataTable
					practiceId={practiceId}
					onEnroll={handleEnroll}
					onLeave={handleLeave}
					maxNumStudentsPerGroup={maxNumStudentsPerGroup}
				/>
			</DialogContent>
		</Dialog>
	)
}
