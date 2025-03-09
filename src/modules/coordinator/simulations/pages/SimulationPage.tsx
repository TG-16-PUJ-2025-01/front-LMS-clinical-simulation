import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { API_URL } from "@/modules/core/config/env"
import { useRef, useEffect, useState } from "react"
import { CommentForm } from "../components/CommentForm"
import { Separator } from "@/modules/core/components/ui/separator"

export default function SimulationPage() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [currentTime, setCurrentTime] = useState(0)

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
							href: "/coordinador/simulacion/123",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Práctica (Grupo X)</LayoutSlot>
			<div className="grid grid-cols-2">
				<section>
					<video
						ref={videoRef}
						src={`${API_URL}/streaming/video/test.mp4`}
						className="aspect-video w-full rounded-md"
						controls
					></video>
					<CommentForm
						timestamp={currentTime}
						onFocus={() => videoRef.current?.pause()}
						onSubmit={() => videoRef.current?.play()}
					/>
					<Separator className="my-2" />
					<h2 className="font-semibold">Comentarios anteriores</h2>
				</section>
			</div>
		</>
	)
}
