import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

import NavBar from "@/modules/core/components/Headers/NavBar"
import StudentGradeTable from "../components/StudentGradeTable"

export default function GradesPage() {
	const { classId } = useParams()

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Asignaturas",
							href: `/estudiante/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/estudiante/calendario",
						},
						{
							label: `Volver a clase`,
							href: `/estudiante/clases/${classId}/practicas`,
						},
						{
							label: "Calificaciones",
							href: `/estudiante/clases/${classId}/calificaciones`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Calificaciones</LayoutSlot>
			<StudentGradeTable />
		</>
	)
}
