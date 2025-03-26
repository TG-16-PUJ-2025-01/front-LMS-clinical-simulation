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

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	classData?: Class
}

const formSchema = z.object({
	javerianaId: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
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
	yearPeriod: z.string({
		required_error: "El periodo academico es requerido",
	}),
	numberOfParticipants: z.number({
		required_error: "El año es requerido",
	}),
})

//lista de strings
const periods = ["10", "20", "30"]

export default function EditClassDialog({ open, onClose, classData }: Props) {
	const [courses, setCourses] = useState<Course[]>([])
	const defaultPeriod = classData?.period || "" // Verifica si classModel.period está definido
	const [defaultYear, defaultYearPeriod] = defaultPeriod.split("-") // Separa el año y período

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
			yearPeriod: periods[0], // Usa el primer período si no hay valor
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
			console.log("Form values before submit:", form.getValues()); // Verifica el estado antes del submit
			console.log("Values received in onSubmit:", values);
	
			if (!values.course || !values.course.courseId) {
				console.error("Error: Course ID is undefined");
				return;
			}
	
			await updateClass(classData!.classId as number, {
				javerianaId: values.javerianaId,
				professorsIds: values.professors.map((professor) => professor.id!),
				courseId: values.course.courseId!,
				period: values.year.toString() + "-" + values.yearPeriod,
				numberOfParticipants: Number(values.numberOfParticipants) //castearlo a numero
			});
	
			onClose(false);
			toast.success("Clase actualizada correctamente");
		} catch (error) {
			toast.error("Error al actualizar la clase");
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
											<Input id="id" placeholder="ID" className="col-span-3 m-0" {...field} />
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
												itemName="course"
												onChange={(selected) => {
													const newCourse = { courseId: selected.key, name: selected.value }
													form.setValue("course", newCourse)
													field.onChange(newCourse)
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
														placeholderText={defaultYear || "Año"}
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

								{/* Período */}
								<div className="w-16">
									<FormField
										control={form.control}
										name="yearPeriod"
										render={({ field }) => (
											<FormItem className="flex items-center">
												<FormControl>
													<Combobox
														placeholderText={defaultYearPeriod || "Período"}
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
											<Input type="number" id="id" placeholder="Cant de participantes" className="col-span-3 m-0" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}  />
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
