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
import Userlist from "@/modules/core/models/userList"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"

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
		id: z.number().optional(),
		name: z.string().nonempty({
			message: "Debe seleccionar un coordinador",
		}),
	})
})

export default function CreateCourseDialog({ open, onClose }: Props) {
	const [coordinators, setCoordinators] = useState<Userlist[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			id: 0,
			coordinator: {
				id: 0,
				name: "",
			}
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
		console.log(values)
		await createCourse({
			idJaveriana: values.id,
			name: values.name,
			coordinatorId: values.id,
			coordinatorName: values.name,
		})

		onClose(false)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
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
								name="coordinator.name"
								render={({field}) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Coordinador</FormLabel>
										<FormControl>
											<Combobox
												placeholderText="Selecciona un coordinador"
												options={coordinators.map((val) => ({ key: val.id, value: val.name }))}
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
