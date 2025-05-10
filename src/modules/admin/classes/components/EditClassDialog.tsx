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
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { updateClass } from "../services/classService"
import Course from "@/modules/core/models/course"
import { getCourses } from "../../courses/services/courseService"
import { NumericFormat } from "react-number-format"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classData?: Class
}

const formSchema = z.object({
	javerianaId: z.number({
		required_error: "El ID es requerido",
	}),
	professors: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string().nonempty({
				message: "Debe seleccionar un profesor",
			}),
		})
	),
	course: z.object({
		courseId: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar la asignatura asociada",
		}),
	}),
	year: z.number({
		required_error: "El año es requerido",
	}),
	yearPeriod: z.string().nonempty({
		message: "El periodo académico es requerido",
	}),
	numberOfParticipants: z.number({
		required_error: "La cantidad de estudiantes es requerida",
	}),
})

//lista de strings
const periods = ["10", "20", "30"]

export default function EditClassDialog({ open, onClose, classData }: Props) {
	const [courses, setCourses] = useState<Course[]>([])
	const defaultPeriod = classData?.period || ""
	const [defaultYear, defaultYearPeriod] = defaultPeriod.split("-")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		shouldUnregister: false,
		defaultValues: {
			...classData,
			javerianaId: undefined,
			professors: [
				{
					id: 0,
					name: "",
				},
			],
			course: classData?.course ?? { courseId: 0, name: "" },
			year: new Date().getFullYear(),
			yearPeriod: periods[0],
			numberOfParticipants: 0,
		},
	})

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 10, "", "name", true)
			setCourses(res.data)
		}

		fetchCourses()
		form.reset({
			...classData,
			javerianaId: classData?.javerianaId,
			course: classData?.course ?? { courseId: 0, name: "" },
			yearPeriod: defaultYearPeriod || periods[0],
			year: Number(defaultYear) || new Date().getFullYear(),
		})
	}, [form, classData])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (!values.course || !values.course.courseId) {
				console.error("Error: Course ID is undefined")
				return
			}

			await updateClass(classData!.classId as number, {
				javerianaId: values.javerianaId,
				professorsIds: values.professors.map((professor) => professor.id!),
				courseId: values.course.courseId!,
				period: values.year.toString() + "-" + values.yearPeriod,
				numberOfParticipants: Number(values.numberOfParticipants),
			})

			onClose(false)
			toast.success("Clase actualizada exitosamente")
		} catch (error) {
			toast.error("Error al actualizar la clase")
		}
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
								name="course"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Asignatura</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value?.name || "Selecciona un curso"}
												options={courses.map((val) => ({
													key: val.courseId,
													value: val.name,
												}))}
												itemName="curso"
												onChange={(selected) => {
													const newCourse = { courseId: selected?.key ?? 0, name: selected?.value ?? "" }
													form.setValue("course", newCourse)
													field.onChange(newCourse)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="year"
								render={() => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className={"col-span-1 m-0 text-right"}>Año y Periodo</FormLabel>
										<div className="col-span-3 flex items-center gap-2">
											<FormControl>
												<Combobox
													placeholderText={form.getValues("year")?.toString() || "Año"}
													options={[...Array(3)].map((_, i) => {
														const year = new Date().getFullYear() + i
														return { key: year, value: year.toString() }
													})}
													itemName="año"
													onChange={(selected) => {
														form.setValue("year", Number(selected?.value))
													}}
												/>
											</FormControl>
											<span className="text-xl font-bold">-</span>
											<FormControl>
												<Combobox
													placeholderText={form.getValues("yearPeriod") || "Periodo"}
													options={periods.map((period) => ({
														key: Number(period),
														value: period,
													}))}
													itemName="periodo"
													onChange={(selected) => {
														form.setValue("yearPeriod", selected?.value.toString() ?? "")
													}}
												/>
											</FormControl>
										</div>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right">
											{form.formState.errors.year?.message ||
												form.formState.errors.yearPeriod?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="numberOfParticipants"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">No. de Participantes</FormLabel>
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
							<Button type="submit">Guardar</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
