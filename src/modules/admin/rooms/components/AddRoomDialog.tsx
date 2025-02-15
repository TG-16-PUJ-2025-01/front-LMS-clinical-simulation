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
import Room from "@/modules/core/models/room"
import { getRoomsTypes, createRoom } from "../services/roomService"
import RoomType from "@/modules/core/models/roomType"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/modules/core/components/ui/command"
import { cn } from "@/modules/core/lib/utils"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	type: z.object({
		id: z.number().optional(),
		name: z.string().min(2, {
			message: "El nombre del tipo de sala debe tener al menos 2 caracteres",
		}),
	}),
})

export default function AddRoomDialog({ open, onClose }: Props) {

	const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
	const [customType, setCustomType] = useState<string>("")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: {
				id: undefined,
				name: "",
			},
		},
	})

	useEffect(() => {
		const fetchRoomTypes = async () => {
			const res = await getRoomsTypes()
			setRoomTypes(res.data)
			console.log("Room Types fetched!", res.data)
		}
		fetchRoomTypes()
	}, [])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (customType) {
				values.type = { id: undefined, name: customType }
			}

			const newRoom: Room = {
				id: undefined,
				name: values.name,
				type: {
					id: values.type.id!,
					name: values.type.name
				}
			}

			await createRoom(newRoom)
			console.log("Sala creada exitosamente:", newRoom)

            toast.success("Sala creada exitosamente")

			onClose(false)
		} catch (error) {
            toast.error("Error al crear la sala")
			console.error("Error al crear la sala:", error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Agregar Sala</DialogTitle>
					<DialogDescription>Puedes agregar una nueva sala con los siguientes atributos</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="grid gap-4 py-4">
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
								name="type"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Tipo de sala</FormLabel>
										<FormControl>
											<Popover open>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														className="col-span-3 justify-between"
													>
														{field.value.name || "Selecciona un tipo"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-[200px] p-0">
													<Command>
														<CommandInput placeholder="Buscar tipo de sala..." />
														<CommandList>
															<CommandEmpty>No se encontró el tipo</CommandEmpty>
															<CommandGroup>
																{roomTypes.map((rt) => (
																	<CommandItem
																		key={rt.id}
																		value={(rt.id ?? "").toString()}
																		onSelect={() => {
																			form.setValue("type", { id: rt.id, name: rt.name })
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				field.value.id === rt.id ? "opacity-100" : "opacity-0"
																			)}
																		/>
																		{rt.name}
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
