import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { StudentsClassDataTable } from "@/modules/student/members/components/MembersClassDataTable"
import { useClassStore } from "@/modules/core/stores/classStore"

export default function MembersPage() {
	const { id } = useParams()
	const classData = useClassStore((state) => state.class)
	const setClassData = useClassStore((state) => state.setClass)

	useEffect(() => {
		const fetchClass = async () => {
			if (!id || Number(id) === classData?.classId) return
			setClassData(Number(id))
		}
		fetchClass()
	}, [id])

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
							href: `/estudiante/clases/${id}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/estudiante/clases/${id}/calificaciones`,
						},
						{
							label: "Volver a la clase",
							href: `/estudiante/clases/${id}/practicas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId ?? ""}) {classData?.course.name ?? ""} - Miembros de la Clase
			</LayoutSlot>
			<StudentsClassDataTable />
		</>
	)
}
