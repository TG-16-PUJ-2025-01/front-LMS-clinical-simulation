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
import { useForm} from "react-hook-form"
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
import Class from "@/modules/core/models/class"
import { toast } from "sonner"
import User from "@/modules/core/models/user"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { createClass, getAllProfessors} from "../services/classService"
import Course from "@/modules/core/models/course"
import { getCourses } from "../../courses/services/courseService"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classData?: Class
}

const formSchema = z.object({
	javerianaId: z.coerce.number().int().positive({
        message: "El ID debe ser un número entero positivo",
    }),
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	professor: z.object({
		id: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar un profesor",
		}),
	}),
	course: z.object({
		id: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar la asignatura asociada",
		}),
	}),
	beginningDate: z.date({
		required_error: "La fecha de inicio debe ser una fecha válida",
	}),
})

export default function CreateClassDialog({ open, onClose}: Props) {
	
	const [courses, setCourses] = useState<Course[]>([])
	const [professors, setProfessors] = useState<User[]>([])
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: undefined,
			javerianaId: undefined,
			professor: {
				id: 0,
				name: "",
			},
			course: {
				id: 0,
				name: "",
			}, 
			beginningDate: new Date(),
		},
	})

	useEffect(() => {
		const fetchProfessors = async () => {
					const res = await getAllProfessors()
					setProfessors(res.data)
				}
				
		fetchProfessors()

		const fetchCourses = async () => {
			const res = await getCourses(0, 10, "", "name", true)
			setCourses(res.data)
		}
		
		fetchCourses()

		form.reset()


	}, [form, open])


	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values)
			await createClass({
				javerianaId: values.javerianaId,
				name: values.name,
				professorsIds: [values.professor.id!],
				courseId: values.course.id!,
				beginningDate: values.beginningDate,
			})
	
			onClose(false)
	
			toast.success("Clase creada correctamente")
		} catch (error) {
			toast.error("Error al crear la clase")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear Clase</DialogTitle>
					<DialogDescription>Ingreasa los siguientes atributos de la nueva clase</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="javerianaId"
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
								name="professor.name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Profesor</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona un profesor"
												options={professors.map((val) => ({ key: val.id, value: `${val.name} ${val.lastName}` }))}
												itemName="profesor"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("professor.id", selected.key)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="course.name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="m-0 text-right">Curso</FormLabel>
									<FormControl>
										<Combobox
											placeholderText="Selecciona un curso"
											options={courses.map((val) => ({ key: val.courseId, value: `${val.name}` }))}
											itemName="curso"
											onChange={(selected) => {
												field.onChange(selected.value)
												form.setValue("course.id", selected.key)
											}}
										/>
									</FormControl>
									<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
								</FormItem>	
								)}
							/>
							<FormField
								control={form.control}
								name="beginningDate"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Fecha de inicio</FormLabel>
										<FormControl>
											<DatePicker
												id="beginningDate"
												className="col-span-3 m-0"
												selected={field.value}
												onSelect={(date) => field.onChange(date ?? null)}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit">Crear</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
