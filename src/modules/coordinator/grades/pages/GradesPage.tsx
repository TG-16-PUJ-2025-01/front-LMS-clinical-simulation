import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

import NavBar from "@/modules/core/components/Headers/NavBar"
import GradeTable from "@/modules/shared/students-grades/components/GradeTable"

export default function GradesPage() {
	const { classId } = useParams()

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Asignaturas",
							href: `/coordinador/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/coordinador/calendario",
						},
						{
							label: "Rúbricas",
							href: "/coordinador/rubricas",
						},
						{
							label: `Volver a clase`,
							href: `/coordinador/clases/${classId}/practicas`,
						},
						{
							label: "Calificaciones",
							href: `/coordinador/clases/${classId}/calificaciones`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Calificaciones</LayoutSlot>
			<GradeTable />
		</>
	)
}
