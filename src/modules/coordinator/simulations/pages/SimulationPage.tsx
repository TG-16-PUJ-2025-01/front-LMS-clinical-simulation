import NavBar from "@/modules/core/components/Headers/NavBar"
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
			console.log(response)
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
	}, [])

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "aqui",
							href: "/coordinador/simulacion/1",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Práctica (Grupo X)</LayoutSlot>
			<div className="grid grid-cols-2">
				<section>
					<video
						ref={videoRef}
						src={`${API_URL}/streaming/video/${simulation?.video.name}`}
						className="aspect-video w-full rounded-md"
						controls
					></video>
					<CommentForm
						timestamp={currentTime}
						videoId={simulation?.video.videoId ?? 0}
						onFocus={() => videoRef.current?.pause()}
						onSubmit={() => {
							videoRef.current?.play()
							setIsSync(false)
						}}
					/>
					<Separator className="my-2" />
					<h2 className="mb-2 font-semibold">Comentarios anteriores</h2>
					{simulation?.video.comments.length === 0 ? (
						<p className="text-sm text-gray-400">No hay comentarios anteriores</p>
					) : (
						<ul>
							{simulation?.video.comments.map((comment) => (
								<li key={comment.timestamp} className="flex items-baseline gap-2">
									<Button
										type="button"
										variant="link"
										className="cursor-pointer p-0 text-xs text-gray-400 h-fit pb-2 w-14"
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
			</div>
		</>
	)
}
