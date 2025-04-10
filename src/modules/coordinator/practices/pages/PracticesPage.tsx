import { useCallback, useEffect, useState } from "react"
import { CardPractice } from "../../../shared/practices/components/CardPractice"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeByClassId } from "../../../shared/practices/services/PracticeService"
import Practice from "@/modules/core/models/practice"
import { Button } from "@/modules/core/components/ui/button"
import DeletePracticeDialog from "../../../shared/practices/components/DeletePracticeDialog"
import EditPracticeDialog from "../../../shared/practices/components/EditPracticeDialog"
import AddPracticeDialog from "../../../shared/practices/components/AddPracticeDialog"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import Class from "@/modules/core/models/class"
import { getClass } from "@/modules/admin/classes/services/classService"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function PracticesPage() {
	const navigate = useNavigate()
	const { id } = useParams()
	const [openDialog, setOpenDialog] = useState<"edit" | "delete" | "add" | null>(null)
	const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null)
	const [classData, setClassData] = useState<Class | null>(null)

	const [data, setData] = useState<Practice[]>([])

	const fetchPractices = useCallback(async () => {
		if (!id) return
		try {
			const res = await getPracticeByClassId(Number(id))
			setData(res.data)
		} catch (error) {
			console.error(error)
			toast.error("No se encuentra la clase")
		}
	}, [id])

	useEffect(() => {
		if (openDialog) return
		fetchPractices()
	}, [openDialog, fetchPractices])

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

	const handleOpenDialog = (type: "edit" | "delete" | "add", practice?: Practice) => {
		setOpenDialog(type)
		setSelectedPractice(practice ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedPractice(null)
		fetchPractices()
	}

	const handlePracticeNavigation = (practice: Practice) => {
		setSelectedPractice(practice)
		navigate(`/coordinador/clases/${id}/practicas/${practice.id}`)
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
						{
							label: "Miembros de la Clase",
							href: `/coordinador/clases/${id}/miembros`,
						},
						{
                            label: "Calificaciones",
                            href: `/coordinador/clases/${id}/calificaciones`,
                        },
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId}) {classData?.course.name} - {classData?.period}
			</LayoutSlot>
			<div className="flex justify-end">
				<Button onClick={() => handleOpenDialog("add")}>Crear Práctica</Button>
			</div>
			<div className="flex min-h-32 items-center justify-center">
				{data.length === 0 ? (
					<p className="text-gray-500">No se encontraron prácticas</p>
				) : (
					<div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,300px)] justify-between gap-y-6">
						{data.map((practice) => (
							<CardPractice
								key={practice.id}
								title={practice.name}
								description={practice.description}
								numberOfGroups={practice.numberOfGroups ?? null}
								maxStudentsGroup={practice.maxStudentsGroup ?? null}
								type={practice.type}
								onClick={() => handlePracticeNavigation(practice)}
								onEdit={() => handleOpenDialog("edit", practice)}
								onDelete={() => handleOpenDialog("delete", practice)}
							/>
						))}
					</div>
				)}
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
			<AddPracticeDialog
				open={openDialog === "add"}
				onClose={handleCloseDialog}
				onPracticeCreated={handlePracticeNavigation}
			/>
		</>
	)
}
