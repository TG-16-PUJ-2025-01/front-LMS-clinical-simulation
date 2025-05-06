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
import PracticeDto from "../dto/practiceDto"

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
	simulationDuration: z.number().min(1, {
		message: "La duración debe ser mayor a 0",
	}),
	numberOfGroups: z.number().nullable().optional(),
	maxStudentsGroup: z.number().nullable().optional(),
	type: z.string(),
})

export default function EditPracticeDialog({ open, onClose, practice }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: practice?.name || "",
			description: practice?.description || "",
			gradeable: practice?.gradeable || false,
			simulationDuration: practice?.simulationDuration || 0,
			numberOfGroups: practice?.numberOfGroups || null,
			maxStudentsGroup: practice?.maxStudentsGroup || null,
			type: practice?.type || "",
		},
	})

	useEffect(() => {
		if (practice) {
			form.reset({
				name: practice.name,
				description: practice.description,
				gradeable: practice.gradeable,
				simulationDuration: practice.simulationDuration,
				numberOfGroups: practice.numberOfGroups,
				maxStudentsGroup: practice.maxStudentsGroup,
				type: practice.type,
			})
		}
	}, [form, practice])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const practiceDto: PracticeDto = {
				name: values.name,
				description: values.description,
				gradeable: values.gradeable,
				simulationDuration: values.simulationDuration,
				numberOfGroups: values.numberOfGroups,
				maxStudentsGroup: values.maxStudentsGroup,
				type: values.type,
			}

			await updatePractice(practice!.id, practiceDto)

			toast.success("Práctica actualizada exitosamente.")

			onClose(false)
		} catch (error) {
			console.error(error)
			toast.error("Error al actualizar la práctica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				{!practice ? (
					<div>Cargando...</div>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Editar práctica</DialogTitle>
							<DialogDescription>
								Puedes editar los siguientes atributos de la sala.{" "}
								<strong>
									<span>
										Si deseas modificar el tipo, número de grupos o duración de la simulación,{" "}
										<u>debes crear otra práctica y eliminar esta.</u>
									</span>
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
												<FormLabel htmlFor="name" className="m-0 text-right">Nombre</FormLabel>
												<FormControl>
													<Input
														id="name"
														placeholder="Nombre"
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
										name="description"
										render={({ field }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="description" className="m-0 text-right">Descripcion</FormLabel>
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
										name="gradeable"
										render={({ field }) => (
											<FormItem className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="gradeable" className="text-right">Evaluación</FormLabel>
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
									<div className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="type" className="m-0 text-right">Tipo</FormLabel>
										<Input
											id="type"
											value={
												practice.type.charAt(0).toUpperCase() +
												practice.type.slice(1).toLowerCase()
											}
											className="col-span-3 m-0"
											disabled
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<FormLabel htmlFor="simulationDuration" className="m-0 text-right">Duración Simulación</FormLabel>
										<div className="col-span-3 flex items-center">
											<Input
												id="simulationDuration"
												name="simulationDuration"
												type="number"
												value={practice.simulationDuration}
												className="m-0 w-24 text-center"
												disabled
											/>
											<span className="ml-2">min</span>
										</div>
									</div>
									{practice.type === "GRUPAL" && (
										<>
											<div className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="numberOfGroups" className="m-0 text-right">Número de grupos</FormLabel>
												<Input
													type="number"
													id="numberOfGroups"
													value={practice.numberOfGroups ?? ""}
													className="col-span-3 m-0"
													disabled
												/>
											</div>
											<div className="grid grid-cols-4 items-center gap-4">
												<FormLabel htmlFor="maxStudentsGroup" className="m-0 text-right">Máximo estudiantes por grupo</FormLabel>
												<Input
													type="number"
													id="maxStudentsGroup"
													value={practice.maxStudentsGroup ?? ""}
													className="col-span-3 m-0"
													disabled
												/>
											</div>
										</>
									)}
								</div>
								<DialogFooter>
									<Button type="submit">Guardar</Button>
								</DialogFooter>
							</Form>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
