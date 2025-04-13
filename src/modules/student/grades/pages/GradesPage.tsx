import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

import NavBar from "@/modules/core/components/Headers/NavBar"
import { useEffect, useState } from "react"
import { StudentGradeDto } from "@/modules/shared/students-grades/services/gradeService"
import { getStudentGradeByClassId } from "../services/GradesService"

export default function GradesPage() {
	const { classId } = useParams()
    const [grades, setGrades] = useState<StudentGradeDto>()

	useEffect(() => {
		const fetchGrades = async () => {
			const res = await getStudentGradeByClassId(Number(classId))
			setGrades(res.data)
		}

		fetchGrades()
	}, [])

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
			<LayoutSlot name="title">Calificaciones Estudiante</LayoutSlot>
		</>
	)
}
