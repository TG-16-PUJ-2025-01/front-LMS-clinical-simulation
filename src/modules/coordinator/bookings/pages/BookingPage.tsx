import { useEffect } from "react"
import { useParams } from "react-router-dom"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { SimulationDataTable } from "@/modules/shared/bookings/components/SimulationDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"
import { useClassStore } from "@/modules/core/stores/classStore"
import { usePracticeStore } from "@/modules/core/stores/practiceStore"

export default function PracticeDetailsPage() {
	const { classId, practiceId } = useParams()
	const practice = usePracticeStore((state) => state.practice)
	const setPractice = usePracticeStore((state) => state.setPractice)
	const classData = useClassStore((state) => state.class)
	const setClassData = useClassStore((state) => state.setClass)

	useEffect(() => {
		const fetchPractice = async () => {
			if (!practiceId || isNaN(Number(practiceId))) return
			setPractice(Number(practiceId))
		}
		fetchPractice()
	}, [practiceId])

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
				({classData?.javerianaId ?? ""}) {classData?.course.name ?? ""} - {practice?.name ?? ""}
			</LayoutSlot>
			{!practice ? <p>Cargando...</p> : <SimulationDataTable practice={practice} />}
		</>
	)
}
