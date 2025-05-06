import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { useClassStore } from "@/modules/core/stores/classStore"
import { StudentsClassDataTable } from "@/modules/shared/members/components/MembersClassDataTable"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

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
							href: `/coordinador/clases/${id}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/coordinador/clases/${id}/calificaciones`,
						},
						{
							label: "Volver a la clase",
							href: `/coordinador/clases/${id}/practicas`,
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
