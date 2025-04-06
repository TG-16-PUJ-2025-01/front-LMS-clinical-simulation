import { useEffect, useState } from "react"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeByClassId } from "../../../shared/practices/services/PracticeService"
import Practice from "@/modules/core/models/practice"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { CardPractice } from "../component/CardPractice"
import ViewGroupsDialog from "../component/ViewGroupsDialog"

export default function PracticesPage() {
	const navigate = useNavigate()
	const { id } = useParams()
	const [openDialog, setOpenDialog] = useState<"group" | null>(null)
	const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null)

	const [data, setData] = useState<Practice[]>([])

	const fetchPractices = async () => {
		if (!id) return
		try {
			const res = await getPracticeByClassId(Number(id))
			setData(res.data)
		} catch (error) {
            console.error(error)
			toast.error("No se encuentra la clase")
		}
	}

	useEffect(() => {
		if (openDialog) return
		fetchPractices()
	}, [])

	const handleOpenDialog = (type: "group", practice?: Practice) => {
		// TODO: Create new dialogs for student
		setOpenDialog(type)
		setSelectedPractice(practice ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedPractice(null)
		fetchPractices()
	}

	const handlePracticeNavigation = (practice: Practice) => {
		// TODO: Only redirect if the student is already in a group
        navigate(`/estudiante/practicas/${practice.id}`)
	}

	return (
		<>
			<LayoutSlot name="header">
				<NavBar />
			</LayoutSlot>
			<LayoutSlot name="title">Prácticas</LayoutSlot>
			<div className="flex justify-center">
				<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{data.map((practice) => (
						<CardPractice
							key={practice.id}
							title={practice.name}
							description={practice.description}
							numberOfGroups={practice.numberOfGroups ?? null}
							maxStudentsGroup={practice.maxStudentsGroup ?? null}
							type={practice.type}
							onClick={() => handlePracticeNavigation(practice)}
							onEdit={() => handleOpenDialog("group", practice)}
						/>
					))}
				</div>
			</div>
			<ViewGroupsDialog
				open={openDialog === "group"}
				onClose={handleCloseDialog}
				practiceId={selectedPractice?.id ?? 0}
			/>
		</>
	)
}
