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
import { createCourse, getAllCoordinators } from "../services/courseService"
import Userlist from "@/modules/core/models/userList"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	course?: Course
}

const formSchema = z.object({
	id: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
	}),
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	coordinatorName: z.string().min(2, {
		message: "El nombre del coordinador debe tener al menos 2 caracteres",
	}),
	coordinatorId: z.coerce.number().int().positive({
		message: "El ID debe ser un número entero positivo",
	}),
})

export default function CreateCourseDialog({ open, onClose, course }: Props) {
	const [coordinators, setCoordinators] = useState<Userlist[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			id: 0,
			coordinatorName: "",
			coordinatorId: 0,
		},
	})

	useEffect(() => {
		const fetchCoordinators = async () => {
			const res = await getAllCoordinators()
			setCoordinators(res.data)
			console.log(res.data)
		}

		fetchCoordinators()

		form.reset({
			name: course?.name,
			id: course?.idJaveriana,
			coordinatorName: course?.coordinatorName,
		})
	}, [form, course])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const newCourse = {
			...values,
		}

		await createCourse(newCourse as Course)

		console.log(values)
		onClose(false)
	}

	//cuando abra el dialogo, se debe hacer una peticion para traer las asignaturas

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear asignatura</DialogTitle>
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
								name="coordinatorName"
								render={() => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Coordinador</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona un coordinador"
												options={coordinators.map((val) => ({ key: val.id, value: val.name }))}
												itemName="coordinador"
												onChange={(selected) => {
													form.setValue("coordinatorId", selected!.key)
													form.setValue("coordinatorName", selected.value)
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
