import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { RubricForm } from "../components/RubricForm"
import { VideoOff } from "lucide-react"
import NavBar from "@/modules/core/components/Headers/NavBar"
import { useClassStore } from "@/modules/core/stores/classStore"
import { usePracticeStore } from "@/modules/core/stores/practiceStore"
import { useSimulationStore } from "@/modules/core/stores/simulationStore"
import VideoTab from "../components/VideoTab"
import Video from "@/modules/core/models/video"
import { Button } from "@/modules/core/components/ui/button"
import { cn } from "@/modules/core/lib/utils"

export default function SimulationPage() {
	const { id } = useParams()
	const classData = useClassStore((state) => state.class)
	const setClassData = useClassStore((state) => state.setClassData)
	const practice = usePracticeStore((state) => state.practice)
	const setPracticeData = usePracticeStore((state) => state.setPracticeData)
	const simulation = useSimulationStore((state) => state.simulation)
	const setSimulation = useSimulationStore((state) => state.setSimulation)
	const [isSync, setIsSync] = useState(false)
	const [selectedVideo, setSelectedVideo] = useState<Video | undefined>()

	useEffect(() => {
		if (isSync) return

		const fetchSimulation = async () => {
			setSimulation(parseInt(id ?? "0"))
		}

		fetchSimulation()
		setIsSync(true)
	}, [isSync, id, setSimulation])

	useEffect(() => {
		if (!simulation) return
		if (!selectedVideo) {
			setSelectedVideo(simulation.videos[0])
		} else {
			const video = simulation.videos.find((video) => video.videoId === selectedVideo.videoId)
			if (video) {
				setSelectedVideo(video)
			}
		}

		if (!simulation || !simulation.practice) return
		setPracticeData(simulation.practice)

		if (!simulation.practice.classModel) return
		setClassData(simulation.practice.classModel)
	}, [simulation, setPracticeData, setClassData, selectedVideo])

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
							label: "Miembros de la clase",
							href: `/coordinador/clases/${classData?.classId}/miembros`,
						},
						{
							label: "Calificaciones",
							href: `/coordinador/clases/${classData?.classId}/calificaciones`,
						},
						{
							label: "Volver a la clase",
							href: `/coordinador/clases/${classData?.classId}/practicas`,
						},
						{
							label: "Volver a la práctica",
							href: `/coordinador/clases/${classData?.classId}/practicas/${practice?.id}`,
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
					{simulation?.videos.length !== 0 ? (
						<div>
							<ul className="mb-2 flex">
								{simulation?.videos.map((video, index) => (
									<li>
										<Button
											variant="ghost"
											className={cn("rounded-b-none border-b-2", {
												"border-blue-javeriana": selectedVideo?.videoId === video.videoId,
											})}
											type="button"
											onClick={() => {
												setSelectedVideo(video)
												setIsSync(false)
											}}
										>
											Video {index}
										</Button>
									</li>
								))}
							</ul>
							<VideoTab video={selectedVideo} sync={() => setIsSync(false)} />
						</div>
					) : (
						<div className="flex aspect-video w-full flex-col items-center justify-center gap-6">
							<p>El video no está disponible para su visualización</p>
							<VideoOff size={64} />
							<div className="h-6"></div>
						</div>
					)}
				</section>
				<section>
					<RubricForm
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
