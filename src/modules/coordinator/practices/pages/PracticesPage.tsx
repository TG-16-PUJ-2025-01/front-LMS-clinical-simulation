import { useEffect, useState } from "react"
import { CardPractice } from "../components/CardPractice"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getAllPractices } from "../services/PracticeService"
import Practice from "@/modules/core/models/practice"
import { Button } from "@/modules/core/components/ui/button"
import DeletePracticeDialog from "../components/DeletePracticeDialog"
import EditPracticeDialog from "../components/EditPracticeDialog"
import AddPracticeDialog from "../components/AddPracticeDialog"

export default function PracticesPage() {
	const [openDialog, setOpenDialog] = useState<"edit" | "delete" | "add" | null>(null)
	const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null)

	const [data, setData] = useState<Practice[]>([])

	const fetchPractices = async () => {
		const res = await getAllPractices(0, 10, "", "name", true)
		setData(res.data)
	}

	useEffect(() => {
		if (openDialog) return
		fetchPractices()
	}, [])

	const handleOpenDialog = (type: "edit" | "delete" | "add", practice?: Practice) => {
		setOpenDialog(type)
		setSelectedPractice(practice ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedPractice(null)
		fetchPractices()
	}

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "aqui",
							href: "coordinador/practicas",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Prácticas</LayoutSlot>
			<div className="mb-4 flex justify-end">
				<Button onClick={() => handleOpenDialog("add")}>Crear Practica</Button>
			</div>
			<div className="flex justify-center">
				<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{data.map((practice) => (
						<CardPractice
							key={practice.id}
							title={practice.name}
							description={practice.description}
							numberOfGroups={practice.numberOfGroups ?? 0}
							type={practice.type}
							onEdit={() => handleOpenDialog("edit", practice)}
							onDelete={() => handleOpenDialog("delete", practice)}
						/>
					))}
				</div>
			</div>
			<DeletePracticeDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				practiceId={selectedPractice?.id ?? null}
			/>
			<EditPracticeDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				practice={selectedPractice!}
			/>
			<AddPracticeDialog open={openDialog === "add"} onClose={handleCloseDialog} />
		</>
	)
}
