import DatePicker from "@/modules/core/components/DatePicker"
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

import { cn } from "@/modules/core/lib/utils"
import { useForm, Controller } from "react-hook-form"
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/modules/core/components/ui/popover"

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/modules/core/components/ui/command"


import { Check, ChevronsUpDown } from "lucide-react"

import { useEffect, useState } from "react"
import Class from "@/modules/core/models/class"

const materias = [
	{ value: "course1", label: "course1" },
	{ value: "course2", label: "course2" },
	{ value: "course3", label: "course4" },
	{ value: "course5", label: "course5" },
	{ value: "course6", label: "course6" },
  ]

const profesores = [
{ value: "professor1", label: "professor1" },
{ value: "professor2", label: "professor2" },
{ value: "professor3", label: "professor3" },
{ value: "professor4", label: "professor4" },
{ value: "professor5", label: "professor5" },
]

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classData?: Class
}

const formSchema = z.object({
	id: z.coerce.number().int().positive({
        message: "El ID debe ser un número entero positivo",
    }),
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	course: z.string().min(2, {
		message: "El nombre del curso debe tener al menos 2 caracteres",
	}),
	professor: z.string().min(2, { 
		message: "El nombre del curso debe tener al menos 2 caracteres",
	}),
})

export default function EditClassDialog({ open, onClose, classData }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: undefined,
			id: undefined,
			course: "",
			professor: "",
		},
	})

	useEffect(() => {
		form.reset({
			name: classData?.name,
			id: classData?.id,
			course: classData?.course,
			professor: classData?.professor,
		})
	}, [form, classData])


	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
		onClose(false)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Clase</DialogTitle>
					<DialogDescription>Puedes editar los siguientes atributos de la clase</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">ID</FormLabel>
										<FormControl>
											<Input id="id" placeholder="ID" className="col-span-3 m-0" {...field} />
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
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
								name="professor"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Profesor</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														className="col-span-3 justify-between"
													>
				
														{field.value
															? profesores.find((fw) => fw.value === field.value)?.label
															: "Selecciona un profesor"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-[200px] p-0">
													<Command>
														<CommandInput placeholder="Buscar materia..." />
														<CommandList>
															<CommandEmpty>No se encontró el profesor</CommandEmpty>
															<CommandGroup>
																{profesores.map((fw) => (
																	<CommandItem
																		key={fw.value}
																		value={fw.value}
																		onSelect={() => {
																			form.setValue("professor", fw.value)
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value === fw.value ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{fw.label}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="course"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Materia</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														className="col-span-3 justify-between"
													>
				
														{field.value
															? materias.find((fw) => fw.value === field.value)?.label
															: "Selecciona una materia"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-[200px] p-0">
													<Command>
														<CommandInput placeholder="Buscar materia..." />
														<CommandList>
															<CommandEmpty>No se encontró materia</CommandEmpty>
															<CommandGroup>
																{materias.map((fw) => (
																	<CommandItem
																		key={fw.value}
																		value={fw.value}
																		onSelect={() => {
																			form.setValue("course", fw.value)
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value === fw.value ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{fw.label}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
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
