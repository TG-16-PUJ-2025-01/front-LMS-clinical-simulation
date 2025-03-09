import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { Button } from "@/modules/core/components/ui/button"
import { getPracticeById } from "../../practices/services/PracticeService"

export default function PracticeDetailsPage() {
	const { id } = useParams()
	const [practice, setPractice] = useState<Practice | null>(null)

	useEffect(() => {
		const fetchPractice = async () => {
			if (!id) return
			const res = await getPracticeById(Number(id)) // Función para obtener la práctica por ID
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
				<NavBar />
			</LayoutSlot>
			<LayoutSlot name="title">{practice.name}</LayoutSlot>
			<div className="mb-4 flex justify-end">
				<Button>Modificar Reservas</Button>
			</div>
		</>
	)
}
