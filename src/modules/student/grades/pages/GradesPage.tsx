import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

import NavBar from "@/modules/core/components/Headers/NavBar"
import StudentGradeTable from "../components/StudentGradeTable"
import { useClassStore } from "@/modules/core/stores/classStore"
import { useEffect } from "react"

export default function GradesPage() {
	const { classId } = useParams()
	const classData = useClassStore((state) => state.class)
	const setClassData = useClassStore((state) => state.setClass)

	useEffect(() => {
		const fetchClass = async () => {
			if (!classId || Number(classId) === classData?.classId) return
			setClassData(Number(classId))
		}
		fetchClass()
	}, [classId])

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
							label: "Miembros de la clase",
							href: `/estudiante/clases/${classId}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/estudiante/clases/${classId}/calificaciones`,
						},
						{
							label: `Volver a la clase`,
							href: `/estudiante/clases/${classId}/practicas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId ?? ""}) {classData?.course.name ?? ""} - Calificaciones
			</LayoutSlot>
			<StudentGradeTable />
		</>
	)
}
