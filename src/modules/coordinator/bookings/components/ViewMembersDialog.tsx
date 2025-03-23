import { useEffect, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { getSimulationStudents } from "../services/bookingService"
import User from "@/modules/core/models/user"
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

interface ViewMembersDialogProps {
	open: boolean
	onClose: () => void
	simulationId: number
}

export default function ViewMembersDialog({ open, onClose, simulationId }: ViewMembersDialogProps) {
	const [students, setStudents] = useState<User[]>([])

	useEffect(() => {
		if (open) {
			const fetchStudents = async () => {
				try {
					const response = await getSimulationStudents(simulationId)
					setStudents(response.data)
				} catch (error) {
					console.error(error)
					toast.error("Error al obtener los estudiantes de la simulación")
				}
			}
			fetchStudents()
		}
	}, [open, simulationId])

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Miembros de la Simulación</DialogTitle>
					<DialogDescription>Estudiantes asociados</DialogDescription>
				</DialogHeader>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Nombre</TableHead>
									<TableHead>Apellido</TableHead>
									<TableHead>Correo</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.length ? (
									students.map((student) => (
										<TableRow key={student.id}>
											<TableCell>{student.institutionalId}</TableCell>
											<TableCell>{student.name}</TableCell>
											<TableCell>{student.lastName}</TableCell>
											<TableCell>{student.email}</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} className="text-center">
											No hay estudiantes inscritos en este horario.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
			</DialogContent>
		</Dialog>
	)
}
