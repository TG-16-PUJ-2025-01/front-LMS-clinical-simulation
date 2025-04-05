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
import Class from "@/modules/core/models/class"
import { toast } from "sonner"
import User from "@/modules/core/models/user"
import { createClass, getAllProfessors } from "../services/classService"
import Course from "@/modules/core/models/course"
import { getCourses } from "../../courses/services/courseService"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { NumericFormat } from "react-number-format";

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classData?: Class
}

const formSchema = z.object({
	javerianaId: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
	}),
	professor: z.object({
		id: z.array(z.number()).optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar un profesor",
		}),
	}),
	course: z.object({
		courseid: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar la asignatura asociada",
		}),
	}),
	year: z.number({
		required_error: "El año es requerido",
	}),
	yearPeriod: z.string({
		required_error: "El periodo academico es requerido",
	}),
	numberOfParticipants: z.number({
		required_error: "La cantidad de estudiantes es requerido",
	}),
})

//lista de trings
const periods = ["10", "20", "30"]

const animatedComponents = makeAnimated()

export default function CreateClassDialog({ open, onClose }: Props) {
	const [courses, setCourses] = useState<Course[]>([])
	const [professors, setProfessors] = useState<User[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			javerianaId: undefined,
			professor: {
				id: [],
				name: "",
			},
			course: {
				courseid: 0,
				name: "",
			},
			year: undefined,
			yearPeriod: "",
			numberOfParticipants: undefined,
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
			await createClass({
				javerianaId: Number(values.javerianaId),
				professorsIds: Array.isArray(values.professor.id) ? values.professor.id : [],
				courseId: values.course.courseid!,
				period: values.year.toString() + "-" + values.yearPeriod,
				numberOfParticipants: Number(values.numberOfParticipants),
			})

			onClose(false)

			toast.success("Clase creada correctamente")
		} catch (error) {
			console.error(error)
			toast.error("Error al crear la clase")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear Clase</DialogTitle>
					<DialogDescription>Ingresa los siguientes atributos de la nueva clase</DialogDescription>
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
											<NumericFormat
												value={field.value}
												onValueChange={(values) => field.onChange(values.floatValue)}
												thousandSeparator={false}
												allowNegative={false}
												customInput={Input}
												placeholder="ID"
												className="col-span-3 m-0"
											/>
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
										<FormLabel className="col-span-1 m-0 text-right">Profesor</FormLabel>
										<FormControl className="col-span-3">
											<Select
												components={animatedComponents}
												isMulti
												options={professors.map((val) => ({
													value: val.id,
													label: `${val.name} ${val.lastName}`,
												}))}
												value={professors
													.filter(
														(prof) =>
															Array.isArray(form.getValues("professor.id") ?? []) &&
															(form.getValues("professor.id") ?? []).includes(prof.id)
													)
													.map((prof) => ({
														value: prof.id,
														label: `${prof.name} ${prof.lastName}`,
													}))}
												onChange={(selected) => {
													const selectedIds = selected.map((prof) => prof.value)
													form.setValue("professor.id", selectedIds as number[])
													field.onChange(selected.map((prof) => prof.label).join(", "))
												}}
												placeholder="Selecciona uno o más profesores"
												className="w-full"
												styles={{
													control: (baseStyles) => ({
														...baseStyles,
														"borderColor": "",
														"borderRadius": "var(--radius-md)",
														"boxShadow": "",
														"&:hover": { borderColor: "" },
														"&:focus": { borderColor: "black" },
													}),
												}}
												classNames={{
													control: () =>
														"flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:shadow-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
												}}
												noOptionsMessage={() => "No se encontraron profesores"}
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
										<FormLabel className="m-0 text-right">Asignatura</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona un curso"
												options={courses.map((val) => ({
													key: val.courseId,
													value: `${val.name}`,
												}))}
												itemName="curso"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("course.courseid", selected.key)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>

							<div className="flex w-full items-center justify-center gap-2">
								<div className="w-24">
									<FormField
										control={form.control}
										name="year"
										render={({ field }) => (
											<FormItem className="flex items-center">
												<FormControl>
													<Combobox
														placeholderText="Año"
														options={[...Array(3)].map((_, i) => {
															const year = new Date().getFullYear() + i
															return { key: year, value: year.toString() }
														})}
														itemName="año"
														onChange={(selected) => field.onChange(Number(selected.value))}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<span className="text-xs">-</span>
								<div className="w-16">
									<FormField
										control={form.control}
										name="yearPeriod"
										render={({ field }) => (
											<FormItem className="flex items-center">
												<FormControl>
													<Combobox
														placeholderText="Período"
														options={periods.map((period) => ({
															key: Number(period),
															value: period,
														}))}
														itemName="período"
														onChange={(selected) => field.onChange(selected.value.toString())}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
							<FormField
								control={form.control}
								name="numberOfParticipants"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">No. participantes</FormLabel>
										<FormControl>
											<NumericFormat
												value={field.value}
												onValueChange={(values) => field.onChange(values.floatValue)}
												thousandSeparator={false}
												allowNegative={false}
												customInput={Input}
												placeholder="Cant de participantes"
												className="col-span-3 m-0"
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
