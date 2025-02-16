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
import { Check, ChevronsUpDown, Command } from "lucide-react"
import { cn } from "@/modules/core/lib/utils"
import { createCourse, getAllCoordinators } from "../services/courseService"
import Userlist from "@/modules/core/models/userList"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/modules/core/components/ui/command"

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
	const [coordinators, setCoordinators] = useState<Userlist[]>([]);
	const [value, setValue] = useState<string>("");


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
				console.log(res.data) // ✅ Mostramos los datos en consola
			
		}

		fetchCoordinators()

		form.reset({
			name: course?.name,
			id: course?.idJaveriana,
			coordinatorName: course?.coordinatorName, // ✅ Solo si `res.data` es un array válido
		})

	}, [form, course])


	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

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
					<DialogDescription>Para crear una asignatura llena los siguientes campos</DialogDescription>
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
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Coordinador</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
														<Button
															variant="outline"
															role="combobox"
															className="col-span-3 justify-between"
														>
															{field.value
																? coordinators.find((fw) => fw.id.toString() === field.value)?.name
																: "Selecciona una asignatura"}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</PopoverTrigger>
												<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput placeholder="Buscar coordinador..." value={value} onValueChange={setValue}/> 
													<CommandList>
														{coordinators.length === 0 && (
															<CommandEmpty>
																No se encontró el coordinador
															</CommandEmpty>
														)}
														<CommandGroup>
														{coordinators.map((coordinator) => (
															<CommandItem
																key={coordinator.id}
																value={coordinator.name}
																onSelect={() => form.setValue("coordinatorName", coordinator.name )}
																>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === coordinator.id.toString() ? "opacity-100" : "opacity-0"
																	)}
																/>
																{coordinator.name}
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
							<Button type="submit" >Crear</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
