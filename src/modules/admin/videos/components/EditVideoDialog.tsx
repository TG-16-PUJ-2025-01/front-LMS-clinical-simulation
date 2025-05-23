import { Button } from "@/modules/core/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { Input } from "@/modules/core/components/ui/input"
import Video from "@/modules/core/models/video"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/modules/core/components/ui/form"
import { useEffect, useState } from "react"
import { updateVideo, getSimulationForVideo, getCandidateSimulationsForSimulation } from "../services/videoService"
import { toast } from "sonner"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import Simulation from "@/modules/core/models/simulation"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	video?: Video
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	simulationId: z.number().optional(),
})

export default function EditVideoDialog({ open, onClose, video }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			simulationId: undefined,
		},
	})

	const [simulations, setSimulations] = useState<Simulation[]>([])

	useEffect(() => {
		if (video) {
			getSimulationForVideo(video.videoId).then((res) => {
				if (res.data) {
					const associatedSimulation = res.data
					getCandidateSimulationsForSimulation(associatedSimulation.simulationId).then(
						(candidatesRes: { data?: Simulation[] }) => {
							const candidates = candidatesRes.data || []
							// Join the associated simulation with the candidates
							setSimulations([associatedSimulation, ...candidates])
							form.reset({
								name: video.name ?? "",
								simulationId: associatedSimulation.simulationId,
							})
						}
					)
				} else {
					setSimulations([])
					form.reset({
						name: video.name ?? "",
						simulationId: undefined,
					})
				}
			})
		}
	}, [form, video])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateVideo(video!.videoId, {
				name: values.name,
				simulationId: values.simulationId,
			})
			toast.success("Video actualizado")
		} catch (error) {
			console.error(error)
			toast.error("Error al actualizar el video")
		}
		onClose(false)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Video</DialogTitle>
					<DialogDescription>Puedes editar los siguientes atributos del video</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Nombre</FormLabel>
										<FormControl>
											<Input id="name" placeholder="Nombre" className="col-span-3 m-0" {...field} />
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="simulationId"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Simulación Asociada</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona una simulación"
												options={simulations.map((sim) => {
													const start = sim.startDateTime ? new Date(sim.startDateTime) : undefined
													const end = sim.endDateTime ? new Date(sim.endDateTime) : undefined
													const dateString = start ? start.toLocaleDateString() : ""
													const startTime = start
														? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
														: ""
													const endTime = end
														? end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
														: ""
													return {
														key: sim.simulationId,
														value: `${sim.practice?.name ?? ""} - Grupo ${sim.groupNumber} - ${dateString} ${startTime} a ${endTime}`,
													}
												})}
												itemName="simulación"
												onChange={(selected) => {
													field.onChange(selected?.key)
													form.setValue("simulationId", selected?.key ?? undefined)
												}}
												selectedValue={(() => {
													const sim = simulations.find((sim) => sim.simulationId === field.value)
													if (!sim) return ""
													const start = sim.startDateTime ? new Date(sim.startDateTime) : undefined
													const end = sim.endDateTime ? new Date(sim.endDateTime) : undefined
													const dateString = start ? start.toLocaleDateString() : ""
													const startTime = start
														? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
														: ""
													const endTime = end
														? end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
														: ""
													return `${sim.practice?.name ?? ""} - Grupo ${sim.groupNumber} - ${dateString} ${startTime} a ${endTime}`
												})()}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit">Guardar</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
