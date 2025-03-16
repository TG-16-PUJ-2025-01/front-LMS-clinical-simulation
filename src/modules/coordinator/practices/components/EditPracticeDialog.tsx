import Practice from "@/modules/core/models/practice"
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
import { useEffect } from "react"
import { toast } from "sonner"
import { updatePractice } from "../services/PracticeService"
import { Checkbox } from "@/modules/core/components/ui/checkbox"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	practice: Practice
}

const formSchema = z.object({
	name: z.string().nonempty({
		message: "El nombre no puede estar vacío",
	}),
	description: z.string().nonempty({
		message: "La descripción no puede estar vacía",
	}),
	gradeable: z.boolean(),
	simulationDuration: z.number().int().min(1, {
		message: "La duración de la simulación debe ser mayor o igual a 15",
	}),
	numberOfGroups: z.number().int().optional(),
	maxStudentsGroup: z.number().int().optional(),
	type: z.string().nonempty({ message: "El tipo no puede estar vacío" }),
})

export default function EditPracticeDialog({ open, onClose, practice }: Props) {
	if (!practice) return null

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			gradeable: false,
		},
	})

	useEffect(() => {
		if (practice) {
			form.reset({
				name: practice.name,
				description: practice.description,
				gradeable: practice.gradeable,
				simulationDuration: practice.simulationDuration,
				numberOfGroups: practice.numberOfGroups ?? undefined,
				maxStudentsGroup: practice.maxStudentsGroup ?? undefined,
				type: practice.type.charAt(0) + practice.type.slice(1).toLowerCase(),
			})
		}
	}, [form, practice])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedPractice: Practice = {
				id: practice.id,
				name: values.name,
				description: values.description,
				type: practice.type,
				gradeable: values.gradeable,
				simulationDuration: practice.simulationDuration,
				numberOfGroups: practice.numberOfGroups,
				maxStudentsGroup: practice.maxStudentsGroup,
			}

			await updatePractice(practice.id, updatedPractice)

			toast.success("Práctica actualizada exitosamente.")

			onClose(false)
		} catch (error: any) {
			toast.error("Error al actualizar la práctica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar práctica</DialogTitle>
					<DialogDescription>
						Puedes editar los siguientes atributos de la sala.{" "}
						<strong>
							<div>
								Si desea modificar el tipo, número de grupos o duración de la simulación,{" "}
								<u>debe crear otra práctica y eliminar esta.</u>
							</div>
						</strong>
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
										<FormLabel className="m-0 text-right">Descripcion</FormLabel>
										<FormControl>
											<Input
												id="description"
												placeholder="Descripcion"
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
											<Input id="type" className="col-span-3 m-0" {...field} disabled />
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
													className="m-0 w-24 text-center"
													disabled
												/>
												<span className="ml-2">min</span>
											</div>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							{practice.type === "GRUPAL" && (
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
														disabled
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
														disabled
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
