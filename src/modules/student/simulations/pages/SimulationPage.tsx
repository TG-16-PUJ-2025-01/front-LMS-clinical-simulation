import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { API_URL } from "@/modules/core/config/env"
import { useRef, useEffect, useState } from "react"
import { formatTimestamp } from "../../../core/lib/utils"
import { Button } from "@/modules/core/components/ui/button"
import { useParams } from "react-router-dom"
import { VideoOff } from "lucide-react"
import NavBar from "@/modules/core/components/Headers/NavBar"
import { EvaluatedRubric } from "../components/EvaluatedRubric"
import GradeStatus from "@/modules/core/models/gradeStatus"
import { useClassStore } from "@/modules/core/stores/classStore"
import { usePracticeStore } from "@/modules/core/stores/practiceStore"
import { useSimulationStore } from "@/modules/core/stores/simulationStore"

export default function SimulationPage() {
	const { id } = useParams()
	const videoRef = useRef<HTMLVideoElement>(null)
	const classData = useClassStore((state) => state.class)
	const setClassData = useClassStore((state) => state.setClassData)
	const practice = usePracticeStore((state) => state.practice)
	const setPracticeData = usePracticeStore((state) => state.setPracticeData)
	const simulation = useSimulationStore((state) => state.simulation)
	const setSimulation = useSimulationStore((state) => state.setSimulation)
	const [isSync, setIsSync] = useState(false)

	useEffect(() => {
		if (isSync) return

		const fetchSimulation = async () => {
			setSimulation(parseInt(id ?? "0"))
		}

		fetchSimulation()
		setIsSync(true)
	}, [isSync, id])

	useEffect(() => {
		if (!simulation || !simulation.practice) return
		setPracticeData(simulation.practice)
		if (!simulation.practice.classModel) return
		setClassData(simulation.practice.classModel)
	}, [simulation])

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
							label: "Miembros de la clase",
							href: `/estudiante/clases/${classData?.classId}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/estudiante/clases/${classData?.classId}/calificaciones`,
						},
						{
							label: "Volver a la clase",
							href: `/estudiante/clases/${classData?.classId}/practicas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">
				({classData?.javerianaId ?? ""}) {classData?.course.name ?? ""} - {practice?.name ?? ""}{" "}
				(Grupo {simulation?.groupNumber})
			</LayoutSlot>
			<div className="grid grid-cols-2 gap-6">
				<section>
					{simulation?.video?.name ? (
						<video
							ref={videoRef}
							src={`${API_URL}/streaming/video/${simulation?.video?.name}`}
							className="aspect-video w-full rounded-md"
							controls
						></video>
					) : (
						<div className="flex aspect-video w-full flex-col items-center justify-center gap-6">
							<p>El video no está disponible para su visualización</p>
							<VideoOff size={64} />
							<div className="h-6"></div>
						</div>
					)}
					<h2 className="my-2 font-semibold">Comentarios del evaluador</h2>
					{simulation?.video?.comments.length === 0 ||
					simulation?.gradeStatus !== GradeStatus.REGISTERED ? (
						<p className="text-sm text-gray-400">No hay comentarios</p>
					) : (
						<ul>
							{simulation?.video?.comments.map((comment) => (
								<li key={comment.timestamp} className="flex items-baseline gap-2">
									<Button
										type="button"
										variant="link"
										className="h-fit w-14 cursor-pointer p-0 pb-2 text-xs text-gray-400"
										onClick={() => {
											if (videoRef.current) videoRef.current.currentTime = comment.timestamp
										}}
									>
										{formatTimestamp(comment.timestamp)}
									</Button>
									<div className="flex flex-col self-stretch">
										<div className="h-full flex-grow border-l border-gray-400"></div>
									</div>
									<p className="text-sm">{comment.message}</p>
								</li>
							))}
						</ul>
					)}
				</section>
				<section>
					<EvaluatedRubric
						rubricTemplate={simulation?.practice?.rubricTemplate ?? undefined}
						gradable={simulation?.practice?.gradeable ?? false}
						rubric={simulation?.rubric ?? undefined}
						gradeStatus={simulation?.gradeStatus ?? undefined}
					/>
				</section>
			</div>
		</>
	)
}
