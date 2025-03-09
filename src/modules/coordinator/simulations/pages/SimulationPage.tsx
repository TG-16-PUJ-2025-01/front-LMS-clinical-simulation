import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { API_URL } from "@/modules/core/config/env"
import { useRef, useEffect, useState } from "react"
import { CommentForm } from "../components/CommentForm"
import { Separator } from "@/modules/core/components/ui/separator"
import Comment from "@/modules/core/models/comment"
import { formatTimestamp } from "../../../core/lib/utils"

export default function SimulationPage() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [previousComments] = useState<Comment[]>([
		{
			timestamp: 300,
			message:
				"Adipisicing tempor dolor Lorem quis do cupidatat culpa incididunt eu laborum nisi cillum tempor duis. Do eu nulla laboris proident aute est aliqua adipisicing reprehenderit aute quis. Veniam voluptate laborum anim cillum ea non do minim fugiat. Tempor labore esse sit ex commodo incididunt sunt sit. Deserunt ipsum magna veniam qui dolor nisi velit consectetur esse.",
		},
		{
			timestamp: 300,
			message:
				"Adipisicing tempor dolor Lorem quis do cupidatat culpa incididunt eu laborum nisi cillum tempor duis. Do eu nulla laboris proident aute est aliqua adipisicing reprehenderit aute quis. Veniam voluptate laborum anim cillum ea non do minim fugiat. Tempor labore esse sit ex commodo incididunt sunt sit. Deserunt ipsum magna veniam qui dolor nisi velit consectetur esse.",
		},
	])

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
					<h2 className="mb-2 font-semibold">Comentarios anteriores</h2>
					{previousComments.length === 0 ? (
						<p className="text-sm text-gray-400">No hay comentarios anteriores</p>
					) : (
						<ul>
							{previousComments.map((comment) => (
								<li key={comment.timestamp} className="flex items-baseline gap-2 pb-4">
									<span className="text-xs text-gray-400">
										{formatTimestamp(comment.timestamp)}
									</span>
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
