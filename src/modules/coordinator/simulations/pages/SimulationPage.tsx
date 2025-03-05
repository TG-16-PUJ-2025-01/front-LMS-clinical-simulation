import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { API_URL } from "@/modules/core/config/env"
import { useRef, useEffect, useState } from "react"

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
			<section className="grid grid-cols-2">
				<div>
					<video
						ref={videoRef}
						src={`${API_URL}/streaming/video/test.mp4`}
						className="aspect-video w-full rounded-md"
						controls
					></video>
					<p>Current Time: {currentTime}</p>
				</div>
			</section>
		</>
	)
}
