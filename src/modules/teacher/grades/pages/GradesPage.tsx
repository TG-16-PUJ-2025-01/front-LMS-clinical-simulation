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
							href: `/profesor/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/profesor/calendario",
						},
						{
							label: "Rúbricas",
							href: "/profesor/rubricas",
						},
						{
							label: `Volver a clase`,
							href: `/profesor/clases/${classId}/practicas`,
						},
						{
							label: "Calificaciones",
							href: `/profesor/clases/${classId}/calificaciones`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Calificaciones</LayoutSlot>
			<GradeTable />
		</>
	)
}
