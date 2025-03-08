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
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Type from "@/modules/core/models/practiceType"
import { updatePractice } from "../services/PracticeService"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/modules/core/components/ui/select"
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
	type: z.string().nonempty({
		message: "El tipo no puede estar vacío",
	}),
	gradeable: z.boolean(),
	numberOfGroups: z.number().int().min(1, {
		message: "El número de grupos debe ser mayor a 0",
	}),
	maxStudentsGroup: z.number().int().min(1, {
		message: "El número máximo de estudiantes por grupo debe ser mayor a 0",
	}),
})

export default function EditPracticeDialog({ open, onClose, practice }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "",
			gradeable: false,
			numberOfGroups: 0,
			maxStudentsGroup: 0,
		},
	})

	useEffect(() => {
		if (practice) {
			form.reset({
				name: practice.name,
				description: practice.description,
				type: practice.type,
				gradeable: practice.gradeable,
				numberOfGroups: practice.numberOfGroups ?? 0,
				maxStudentsGroup: practice.maxStudentsGroup ?? 0,
			})
		}
	}, [form, practice])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedPractice: Practice = {
				id: practice.id,
				name: values.name,
				description: values.description,
				type: values.type as Type,
				gradeable: values.gradeable,
				numberOfGroups: values.numberOfGroups,
				maxStudentsGroup: values.maxStudentsGroup,
			}

			await updatePractice(practice.id, updatedPractice)

			toast.success("Práctica actualizada exitosamente.")

			onClose(false)
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.message) {
				toast.error(error.response.data.message)
			} else {
				toast.error("Error al actualizar la práctica")
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar práctica</DialogTitle>
					<DialogDescription>
						Puedes editar los siguientes atributos de la sala. Si deseas modificar el tipo, debes
						crea otra practica.
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
											<Select>
												<SelectTrigger className="w-[180px]">
													<SelectValue
														placeholder={
															field.value
																? field.value.charAt(0) + field.value.slice(1).toLowerCase()
																: ""
														}
													/>
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
