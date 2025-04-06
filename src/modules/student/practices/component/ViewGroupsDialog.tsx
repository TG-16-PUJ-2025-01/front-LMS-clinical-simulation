import { useEffect, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { format } from "date-fns";
import Simulation from "@/modules/core/models/simulation"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import { DialogDescription } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { Button } from "@/modules/core/components/ui/button";
import { getSimulationsByPracticeId } from "@/modules/coordinator/bookings/services/bookingService";

interface ViewGroupsDialog {
	open: boolean
	onClose: () => void
	practiceId: number
}

export default function ViewGroupsDialog({ open, onClose, practiceId }: ViewGroupsDialog) {
	const [data, setData] = useState<Simulation[]>([]);

	useEffect(() => {
			const fetchSimulations = async () => {
				try {
					console.log("Entreee")
					const res = await getSimulationsByPracticeId(
						practiceId,
						1, // Default page number
						10, // Default page size
						"", // Default filter
						"simulationId", // Default sort field
						true // Default ascending order
					)
					console.log(res.data);
					setData(data);
				} catch (error) {
					console.error(error);
					toast.error("Error al obtener los horarios de simulación");
				}
			
			fetchSimulations();
		}
	}, [open, practiceId]);

	const handleEnroll = (simulationId: number) => {
		// TODO: Llamar a API para inscribir al estudiante en el grupo
		toast.success(`Inscrito en el grupo ${simulationId}`);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Grupos Disponibles a Inscripción</DialogTitle>
					<DialogDescription>Los siguientes son los horarios establecidos por el profesor, por favor inscribase a uno de ellos.</DialogDescription>
				</DialogHeader>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Número de Grupo</TableHead>
								<TableHead>Hora de Inicio</TableHead>
								<TableHead>Hora de Finalización</TableHead>
								<TableHead>Inscribirse</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.length ? (
								data.map((simulation) => (
									<TableRow key={simulation.simulationId}>
										{/* <TableCell>{simulation.groupNumber}</TableCell> */}
										<TableCell>{format(new Date(simulation.startDateTime), "dd/MM/yyyy HH:mm")}</TableCell>
										<TableCell>{format(new Date(simulation.endDateTime), "dd/MM/yyyy HH:mm")}</TableCell>
										<TableCell>
											<Button onClick={() => handleEnroll(simulation.simulationId)}>
												Inscribirse
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										No hay horarios disponibles.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
}
