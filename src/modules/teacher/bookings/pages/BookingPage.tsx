import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeById } from "@/modules/shared/practices/services/PracticeService"
import { SimulationDataTable } from "@/modules/shared/bookings/components/SimulationDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function PracticeDetailsPage() {
	const { classId, practiceId } = useParams()
	const [practice, setPractice] = useState<Practice | null>(null)

	useEffect(() => {
		const fetchPractice = async () => {
			if (!practiceId || isNaN(Number(practiceId))) return
			const res = await getPracticeById(Number(practiceId))
			setPractice(res.data)
		}
		fetchPractice()
	}, [practiceId])

	if (!practice) {
		return <p>Cargando...</p>
	}

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
			<LayoutSlot name="title">{practice.name}</LayoutSlot>
			<SimulationDataTable practice={practice} />
		</>
	)
}
