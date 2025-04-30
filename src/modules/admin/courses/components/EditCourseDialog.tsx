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
import Course from "@/modules/core/models/course"
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
import { getAllCoordinators, updateCourse } from "../services/courseService"
import { toast } from "sonner"
import User from "@/modules/core/models/user"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { se } from "date-fns/locale"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	course?: Course
}

const formSchema = z.object({
	javerianaId: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
	}),
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	coordinator: z.object({
		id: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar un coordinador",
		}),
	}),
	semester: z.number().int().positive({
		message: "El semestre debe ser un número entero positivo",
	}),
	program: z.string().min(2, {
		message: "El programa debe tener al menos 2 caracteres",
	}),
	department: z.string().min(2, {
		message: "El departamento debe tener al menos 2 caracteres",
	}),
	faculty: z.string().min(2, {
		message: "La facultad debe tener al menos 2 caracteres",
	}),
})

export default function EditCourseDialog({ open, onClose, course }: Props) {
	const [coordinators, setCoordinators] = useState<User[]>([])

	const semesters = Array.from({ length: 14 }, (_, i) => i + 1)

	const programs = [
		{ key: 1, value: "pregrado" },
		{ key: 2, value: "maestria" },
		{ key: 3, value: "doctorado" },
	]

	const departments = [
		{ key: 1, value: "enfermeria clinica" },
		{ key: 2, value: "medicina interna" },
		{ key: 3, value: "medicina familiar" },
		{ key: 4, value: "medicina critica" },
	]

	const faculties = [
		{ key: 1, value: "medicina" },
		{ key: 2, value: "enfermeria" },
		{ key: 3, value: "odontologia" },
	]

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...course,
			name: undefined,
			javerianaId: undefined,
			coordinator: {
				id: 0,
				name: "",
			},
			semester: 1,
			program: "",
			department: "",
			faculty: "",
		},
	})

	useEffect(() => {
		const fetchCoordinators = async () => {
			const res = await getAllCoordinators()
			setCoordinators(res.data)
		}

		fetchCoordinators()

		form.reset({
			...course,
			name: course?.name,
			javerianaId: course?.javerianaId,
		})
	}, [form, course])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateCourse(course!.courseId as number, {
				javerianaId: values.javerianaId,
				name: values.name,
				coordinatorId: values.coordinator.id!,
				semester: course!.semester,
				program: course!.program,
				department: course!.department,
				faculty: course!.faculty,
			})

			onClose(false)

			toast.success("Asignatura actualizada exitosamente")
		} catch (error) {
			toast.error("Error al actualizar la asignatura")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Asignatura</DialogTitle>
					<DialogDescription>
						Puedes editar los siguientes atributos de la asignatura
					</DialogDescription>
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
								name="coordinator.name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Coordinador</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value}
												options={coordinators.map((val) => ({
													key: val.id,
													value: `${val.name} ${val.lastName}`,
												}))}
												itemName="coordinador"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("coordinator.id", selected.key)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="semester"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Semestre</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value.toString()}
												options={semesters.map((val) => ({ key: val, value: `${val}` }))}
												itemName="semester"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("semester", selected.key ?? 1)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="faculty"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Facultad</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value.toString()}
												options={faculties.map((val) => ({ key: val.key, value: `${val.value}` }))}
												itemName="faculty"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("faculty", selected.value)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="department"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Departamento</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value.toString()}
												options={departments.map((val) => ({
													key: val.key,
													value: `${val.value}`,
												}))}
												itemName="department"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("department", selected.value)
												}}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="program"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Programa</FormLabel>
										<FormControl>
											<Combobox
												placeholderText={field.value.toString()}
												options={programs.map((val) => ({ key: val.key, value: `${val.value}` }))}
												itemName="program"
												onChange={(selected) => {
													field.onChange(selected.value)
													form.setValue("program", selected.value)
												}}
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
