import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { API_URL } from "@/modules/core/config/env"
import { useRef, useEffect, useState } from "react"
import { CommentForm } from "../components/CommentForm"
import { Separator } from "@/modules/core/components/ui/separator"
import { formatTimestamp } from "../../../core/lib/utils"
import { Button } from "@/modules/core/components/ui/button"
import Simulation from "@/modules/core/models/simulation"
import { useParams } from "react-router-dom"
import { getSimulationById } from "../services/simulationService"
import { RubricForm } from "../components/RubricForm"
import { VideoOff } from "lucide-react"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function SimulationPage() {
	const params = useParams()
	const videoRef = useRef<HTMLVideoElement>(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [simulation, setSimulation] = useState<Simulation>()
	const [isSync, setIsSync] = useState(false)

	useEffect(() => {
		if (isSync) return

		const fetchSimulation = async () => {
			const response = await getSimulationById(parseInt(params.id ?? "0"))
			setSimulation(response.data)
		}

		fetchSimulation()
		setIsSync(true)
	}, [isSync, params.id])

	useEffect(() => {
		const videoElement = videoRef.current
		if (videoElement) {
			const handleTimeUpdate = () => {
				setCurrentTime(Math.floor(videoElement.currentTime))
			}

			videoElement.addEventListener("timeupdate", handleTimeUpdate)

			return () => {
				videoElement.removeEventListener("timeupdate", handleTimeUpdate)
			}
		}
	}, [simulation?.video])

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
							label: `(${simulation?.practice.classModel.javerianaId ?? ""}) ${simulation?.practice.classModel.course.name ?? ""}`,
							href: `/coordinador/clases/${simulation?.practice.classModel.classId}/practicas`,
						},
						{
							label: simulation?.practice.name ?? "",
							href: `/coordinador/clases/${simulation?.practice.classModel.classId}/practicas/${simulation?.practice.id}`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">{simulation?.practice.name ?? ""} (Grupo {simulation?.groupNumber})</LayoutSlot>
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
					<CommentForm
						timestamp={currentTime}
						videoId={simulation?.video?.videoId ?? 0}
						onFocus={() => videoRef.current?.pause()}
						onSubmit={() => {
							videoRef.current?.play()
							setIsSync(false)
						}}
					/>
					<Separator className="my-2" />
					<h2 className="mb-2 font-semibold">Comentarios anteriores</h2>
					{simulation?.video?.comments.length === 0 ? (
						<p className="text-sm text-gray-400">No hay comentarios anteriores</p>
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
					<RubricForm
						rubricTemplate={{
							courses: [],
							archived: false,
							creationDate: new Date(),
							creator: {
								id: 1,
								email: "",
								name: "",
								lastName: "",
								institutionalId: 1,
								roles: [],
								username: "",
							},
							title: "Mi rúbrica",
							columns: [
								{
									rubricColumnId: Date.now() + 1,
									title: "No aprobado",
									scoringScale: {
										lowerValue: 0,
										upperValue: 3,
									},
								},
								{
									rubricColumnId: Date.now() + 2,
									title: "Aprobado",
									scoringScale: {
										lowerValue: 3,
										upperValue: 5,
									},
								},
							],
							criteria: [
								{
									criteriaId: Date.now() + 1,
									name: "A",
									weight: 50,
									scoringScaleDescription: ["Descripción", "Descripción"],
								},
								{
									criteriaId: Date.now() + 2,
									name: "B",
									weight: 50,
									scoringScaleDescription: ["Descripción", "Descripción"],
								},
							],
						}}
					/>
				</section>
			</div>
		</>
	)
}
