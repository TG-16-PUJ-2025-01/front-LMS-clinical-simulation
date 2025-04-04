import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeById } from "../../../shared/practices/services/PracticeService"
import { SimulationDataTable } from "../components/SimulationDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function PracticeDetailsPage() {
	const { id } = useParams()
	const [practice, setPractice] = useState<Practice | null>(null)

	useEffect(() => {
		const fetchPractice = async () => {
			if (!id || isNaN(Number(id))) return
			const res = await getPracticeById(Number(id))
			setPractice(res.data)
		}
		fetchPractice()
	}, [id])

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
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">{practice.name}</LayoutSlot>
			<SimulationDataTable />
		</>
	)
}
