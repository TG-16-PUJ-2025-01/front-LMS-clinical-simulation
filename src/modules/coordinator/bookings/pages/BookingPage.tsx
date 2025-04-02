import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeById } from "../../practices/services/PracticeService"
import { SimulationDataTable } from "../components/simulationDataTable"

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
			<LayoutSlot name="title">{practice.name}</LayoutSlot>
			<SimulationDataTable />
		</>
	)
}
