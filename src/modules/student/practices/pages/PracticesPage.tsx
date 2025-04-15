import { useCallback, useEffect, useState } from "react"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { getPracticeByClassId } from "../../../shared/practices/services/PracticeService"
import Practice from "@/modules/core/models/practice"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { CardPractice } from "../components/CardPractice"
import ViewGroupsDialog from "../components/ViewGroupsDialog"
import { getEnroledSimulationId } from "../services/practicesService"
import Class from "@/modules/core/models/class"
import { getClass } from "@/modules/admin/classes/services/classService"

export default function PracticesPage() {
	const navigate = useNavigate()
	const { id } = useParams()
	const [openDialog, setOpenDialog] = useState<"group" | null>(null)
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

	const handleOpenDialog = (type: "group", practice?: Practice) => {
		setOpenDialog(type)
		setSelectedPractice(practice ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedPractice(null)
		fetchPractices()
	}

	const handlePracticeNavigation = async (practiceId: number) => {
		try {
			const res = await getEnroledSimulationId(practiceId)
			if (res.data !== null) {
				navigate(`/estudiante/practicas/${practiceId}`)
			} else {
				toast.error("Debes estar inscrito en un grupo para acceder a la práctica.")
			}
		} catch (error) {
			console.error(error)
			toast.error("Ocurrió un error al verificar la inscripción.")
		}
	}

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
							label: "Miembros de la Clase",
							href: `/estudiante/clases/${id}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/estudiante/clases/${id}/calificaciones`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId}) {classData?.course.name} - {classData?.period}
			</LayoutSlot>
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
								onClick={() => handlePracticeNavigation(practice.id)}
								onEdit={() => handleOpenDialog("group", practice)}
							/>
						))}
					</div>
				)}
			</div>
			<ViewGroupsDialog
				open={openDialog === "group"}
				onClose={handleCloseDialog}
				practiceId={selectedPractice?.id ?? 0}
			/>
		</>
	)
}
