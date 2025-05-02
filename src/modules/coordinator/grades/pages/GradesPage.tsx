import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

import NavBar from "@/modules/core/components/Headers/NavBar"
import GradeTable from "@/modules/shared/students-grades/components/GradeTable"
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
							label: "Miembros de la clase",
							href: `/coordinador/clases/${classId}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/coordinador/clases/${classId}/calificaciones`,
						},
						{
							label: `Volver a la clase`,
							href: `/coordinador/clases/${classId}/practicas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId ?? ""}) {classData?.course.name ?? ""} - Calificaciones
			</LayoutSlot>
			<GradeTable />
		</>
	)
}
