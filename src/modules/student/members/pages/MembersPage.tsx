import { getClass } from "@/modules/admin/classes/services/classService"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import Class from "@/modules/core/models/class"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { StudentsClassDataTable } from "@/modules/student/members/components/MembersClassDataTable"

export default function MembersPage() {
	const { id } = useParams()
	const [classData, setClassData] = useState<Class | null>(null)

	useEffect(() => {
		const fetchClass = async () => {
			if (!id) return
			try {
				const res = await getClass(Number(id))
				setClassData(res.data)
			} catch (error) {
				console.error(error)
				toast.error("No se encuentra la clase")
			}
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
							label: "Calificaciones",
							href: `/estudiante/clases/${id}/calificaciones`,
						},
						{
							label: `(${classData?.javerianaId ?? ""}) ${classData?.course.name ?? ""}`,
							href: `/estudiante/clases/${id}/practicas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Miembros de la Clase</LayoutSlot>
			<StudentsClassDataTable />
		</>
	)
}
