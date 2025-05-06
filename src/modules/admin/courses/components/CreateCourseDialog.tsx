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
import { createCourse, getAllCoordinators } from "../services/courseService"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import User from "@/modules/core/models/user"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
}

const formSchema = z.object({
	id: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
	}),
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	coordinator: z.object({
		coordinatorId: z.number().optional(),
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

export default function CreateCourseDialog({ open, onClose }: Props) {
	const [coordinators, setCoordinators] = useState<User[]>([])
	//un for del 1 hasta el 14
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
			name: "",
			id: 0,
			coordinator: {
				coordinatorId: 0,
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

		form.reset()
	}, [form, open])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log("Valores enviados:", values)
			await createCourse({
				javerianaId: values.id,
				name: values.name,
				coordinatorId: values.coordinator.coordinatorId!,
				semester: values.semester,
				program: values.program,
				department: values.department,
				faculty: values.faculty,
			})

			onClose(false)
			toast.success("Asignatura creada exitosamente")
		} catch (error) {
			console.error(error)
			toast.error("Error al crear la asignatura")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Crear Asignatura</DialogTitle>
					<DialogDescription>
						Para crear una asignatura llena los siguientes campos
					</DialogDescription>
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
								name="coordinator.name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Coordinador</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona un coordinador"
												options={coordinators.map((val) => ({
													key: val.id,
													value: `${val.name} ${val.lastName}`,
												}))}
												itemName="coordinador"
												onChange={(selected) => {
													field.onChange(selected?.value)
													form.setValue("coordinator.coordinatorId", selected?.key ?? 0)
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
												placeholderText="Semestre"
												options={semesters.map((val) => ({ key: val, value: `${val}` }))}
												itemName="semester"
												onChange={(selected) => {
													field.onChange(selected?.value)
													form.setValue("semester", selected?.key ?? 0)
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
												placeholderText="Facultad"
												options={faculties.map((val) => ({ key: val.key, value: `${val.value}` }))}
												itemName="faculty"
												onChange={(selected) => {
													field.onChange(selected?.value)
													form.setValue("faculty", selected?.value ?? "")
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
												placeholderText="Facultad"
												options={departments.map((val) => ({
													key: val.key,
													value: `${val.value}`,
												}))}
												itemName="department"
												onChange={(selected) => {
													field.onChange(selected?.value)
													form.setValue("department", selected?.value ?? "")
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
												placeholderText="Programa"
												options={programs.map((val) => ({ key: val.key, value: `${val.value}` }))}
												itemName="program"
												onChange={(selected) => {
													field.onChange(selected?.value)
													form.setValue("program", selected?.value ?? "")
												}}
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
