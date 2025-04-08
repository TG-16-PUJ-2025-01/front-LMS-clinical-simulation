import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import GroupsDataTable from "./GroupsDataTable"
import { getEnroledSimulationId, joinSimulation } from "../services/practicesService"
import { useEffect } from "react"

interface ViewGroupsDialog {
	open: boolean
	onClose: () => void
	practiceId: number
}

export default function ViewGroupsDialog({ open, onClose, practiceId }: ViewGroupsDialog) {
	const handleEnroll = async (simulationId: number) => {
		try {
			await joinSimulation(simulationId)
			toast.success(`Inscrito en el grupo ${simulationId}`)
		} catch (error) {
			toast.error("Error al inscribirse en el grupo")
			console.error(error)
		}
	}

	useEffect(() => {
		if (open) {
			// Fetch the enrolled simulation ID when the dialog opens
			const fetchEnrolledSimulationId = async () => {
				try {
					const res = await getEnroledSimulationId(practiceId)
					console.log("Enrolled simulation ID:", res.data)
				} catch (error) {
					console.error("Error fetching enrolled simulation ID:", error)
				}
			}
			fetchEnrolledSimulationId()
		}
	})

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Grupos Disponibles a Inscripción</DialogTitle>
					<DialogDescription>
						Los siguientes son los horarios establecidos por el profesor, por favor inscríbase a uno
						de ellos.
					</DialogDescription>
				</DialogHeader>
				<GroupsDataTable practiceId={practiceId} onEnroll={handleEnroll} />
			</DialogContent>
		</Dialog>
	)
}
