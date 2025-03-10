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
}

const formSchema = z
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
				return data.numberOfGroups
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
				return data.maxStudentsGroup
			}
			return true
		},
		{
			message: "No debe ingresar el número de grupos ni el máximo de estudiantes por grupo",
			path: ["maxStudentsGroup"],
		}
	)

export default function AddPracticeDialog({ open, onClose, onPracticeCreated }: Props) {
	const [isGroupPractice, setIsGroupPractice] = useState<boolean>(true)
	const [, setPractice] = useState<Practice | null>(null)
	const { id } = useParams()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
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
	}, [open])

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Error al crear la práctica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Agregar Práctica</DialogTitle>
					<DialogDescription>
						Puedes agregar una nueva practica con los siguientes atributos
					</DialogDescription>
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
								name="description"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Descripción</FormLabel>
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
										<FormLabel className="m-0 text-right">Tipo</FormLabel>
										<FormControl>
											<Select
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
										<FormLabel className="text-right">Evaluación</FormLabel>
										<div className="col-span-3 flex items-center gap-2">
											<FormControl>
												<Checkbox
													id="gradeable"
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
										<FormLabel className="m-0 text-right">Duración Simulación</FormLabel>
										<FormControl>
											<div className="col-span-3 flex items-center">
												<Input
													type="number"
													value={field.value}
													onChange={(e) => field.onChange(Number(e.target.value))}
													step={15}
													min={0}
													className="m-0 w-24 text-center"
													onKeyDown={(e) => e.preventDefault()}
												/>
												<span className="ml-2">min</span>
											</div>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							{isGroupPractice && (
								<>
									<FormField
										control={form.control}
										name="numberOfGroups"
										render={({ field }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel className="m-0 text-right">Número de grupos</FormLabel>
												<FormControl>
													<Input
														type="number"
														id="numberOfGroups"
														className="col-span-3 m-0"
														value={field.value ?? ""}
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
												<FormLabel className="m-0 text-right">
													Máximo estudiantes por grupo
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														id="maxStudentsGroup"
														className="col-span-3 m-0"
														value={field.value ?? ""}
														onChange={(e) =>
															field.onChange(e.target.value ? Number(e.target.value) : null)
														}
													/>
												</FormControl>
												<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
											</FormItem>
										)}
									/>
								</>
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
