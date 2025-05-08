import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import { Input } from "@/modules/core/components/ui/input"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/modules/core/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/modules/core/components/ui/select"
import { Checkbox } from "@/modules/core/components/ui/checkbox"
import { Button } from "@/modules/core/components/ui/button"
import Type from "@/modules/core/models/practiceType"
import { createPractice } from "../services/PracticeService"
import PracticeDto from "../dto/practiceDto"
import Practice from "@/modules/core/models/practice"
import { useParams } from "react-router-dom"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	onPracticeCreated: (practice: Practice) => void
	numberOfParticipants: number
}

const getFormSchema = (numberOfParticipants: number) =>
	z
		.object({
			name: z.string().nonempty({ message: "El nombre no puede estar vacío" }),
			description: z.string().nonempty({ message: "La descripción no puede estar vacía" }),
			type: z.string().nonempty({ message: "El tipo no puede estar vacío" }),
			gradeable: z.boolean(),
			simulationDuration: z.number().int().min(1, {
				message: "La duración de la simulación debe ser mayor o igual a 15",
			}),
			numberOfGroups: z.number().int().optional(),
			maxStudentsGroup: z.number().int().optional(),
		})
		.refine(
			(data) => {
				if (data.type === "GRUPAL") {
					return data.numberOfGroups && data.maxStudentsGroup
				}
				return true
			},
			{
				message: "Debe ingresar el número de grupos y el máximo de estudiantes por grupo",
				path: ["numberOfGroups"],
			}
		)
		.refine(
			(data) => {
				if (data.type === "GRUPAL") {
					return data.numberOfGroups! * data.maxStudentsGroup! >= numberOfParticipants
				}
				return true
			},
			{
				message:
					"El número total de estudiantes por grupo no cubre el número de participantes de la clase",
				path: ["numberOfGroups"],
			}
		)

export default function AddPracticeDialog({
	open,
	onClose,
	onPracticeCreated,
	numberOfParticipants,
}: Props) {
	const [isGroupPractice, setIsGroupPractice] = useState<boolean>(true)
	const [, setPractice] = useState<Practice | null>(null)
	const { id } = useParams()

	const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
		resolver: zodResolver(getFormSchema(numberOfParticipants)),
		defaultValues: {
			name: "",
			description: "",
			type: "",
			gradeable: false,
			simulationDuration: 0,
			numberOfGroups: 0,
			maxStudentsGroup: 0,
		},
	})

	useEffect(() => {
		if (open) {
			form.reset()
		}
	}, [open, form])

	async function onSubmit(values: z.infer<ReturnType<typeof getFormSchema>>) {
		try {
			const newPractice: PracticeDto = {
				name: values.name,
				description: values.description,
				type: values.type as Type,
				gradeable: values.gradeable,
				simulationDuration: values.simulationDuration,
				...(isGroupPractice && {
					numberOfGroups: values.numberOfGroups ?? null,
					maxStudentsGroup: values.maxStudentsGroup ?? null,
				}),
			}

			const response = await createPractice(Number(id), newPractice)
			setPractice(response.data)

			toast.success("Práctica creada exitosamente.")

			onPracticeCreated(response.data)

			onClose(false)
		} catch (error) {
			console.error(error)
			toast.error("Error al crear la práctica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar Práctica</DialogTitle>
					<DialogDescription>
						Puedes agregar una nueva práctica con los siguientes atributos. <br />
						<strong>
							Si seleccionas el tipo "Grupal", asegúrate de que la capacidad total cubra el número
							de participantes de la clase ({numberOfParticipants} estudiantes).
						</strong>
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
					<Form {...form}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="name" className="m-0 text-right">
											Nombre
										</FormLabel>
										<FormControl>
											<Input id="name" placeholder="Nombre" className="col-span-3 m-0" {...field} />
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="description" className="m-0 text-right">
											Descripción
										</FormLabel>
										<FormControl>
											<Input
												id="description"
												placeholder="Descripción"
												className="col-span-3 m-0"
												{...field}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="type" className="m-0 text-right">
											Tipo
										</FormLabel>
										<FormControl>
											<Select
												name="type"
												onValueChange={(value) => {
													field.onChange(value)
													setIsGroupPractice(value === "GRUPAL")
												}}
												value={field.value}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Seleccione un tipo" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="GRUPAL">Grupal</SelectItem>
													<SelectItem value="INDIVIDUAL">Individual</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="gradeable"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="gradeable" className="text-right">
											Evaluación
										</FormLabel>
										<div className="col-span-3 flex items-center gap-2">
											<FormControl>
												<Checkbox
													id="gradeable"
													name="gradeable"
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel htmlFor="gradeable">¿Práctica Evaluable?</FormLabel>
										</div>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="simulationDuration"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="simulationDuration" className="m-0 text-right">
											Duración Simulación
										</FormLabel>
										<FormControl>
											<div className="col-span-3 flex items-center">
												<Input
													id="simulationDuration"
													name="simulationDuration"
													type="number"
													value={field.value ?? ""}
													onChange={(e) => {
														const newValue = e.target.value === "" ? "" : Number(e.target.value)
														field.onChange(newValue)
													}}
													onBlur={(e) => {
														const value = Number(e.target.value)
														if (value % 15 !== 0) {
															field.onChange(0)
														}
													}}
													step={15}
													min={0}
													className="m-0 w-24 text-center"
												/>
												<span className="ml-2">min</span>
											</div>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>

							{isGroupPractice && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="numberOfGroups"
										render={({ field }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="numberOfGroups" className="m-0 text-right">
													Número de grupos
												</FormLabel>
												<FormControl>
													<Input
														id="numberOfGroups"
														name="numberOfGroups"
														type="number"
														className="col-span-3 m-0"
														value={field.value ?? ""}
														min={0}
														onChange={(e) =>
															field.onChange(e.target.value ? Number(e.target.value) : null)
														}
													/>
												</FormControl>
												<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="maxStudentsGroup"
										render={({ field }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="maxStudentsGroup" className="m-0 text-right">
													Máximo estudiantes por grupo
												</FormLabel>
												<FormControl>
													<Input
														id="maxStudentsGroup"
														name="maxStudentsGroup"
														type="number"
														className="col-span-3 m-0"
														value={field.value ?? ""}
														min={0}
														onChange={(e) =>
															field.onChange(e.target.value ? Number(e.target.value) : null)
														}
													/>
												</FormControl>
												<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
											</FormItem>
										)}
									/>
									<div className="col-span-4 mt-4 text-sm text-gray-600">
										{form.watch("numberOfGroups") && form.watch("maxStudentsGroup") ? (
											<>
												<p>
													Capacidad total:{" "}
													<strong>
														{(form.watch("numberOfGroups") ?? 0) *
															(form.watch("maxStudentsGroup") ?? 0)}
													</strong>{" "}
													estudiantes
												</p>
												{(form.watch("numberOfGroups") ?? 0) *
													(form.watch("maxStudentsGroup") ?? 0) <
												numberOfParticipants ? (
													<p className="text-red-500">
														La capacidad total no cubre el número de participantes de la clase (
														{numberOfParticipants}).
													</p>
												) : (
													<p className="text-green-500">
														La capacidad total cubre el número de participantes de la clase.
													</p>
												)}
											</>
										) : (
											<p>Ingrese el número de grupos y el máximo de estudiantes por grupo.</p>
										)}
									</div>
								</div>
							)}
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
