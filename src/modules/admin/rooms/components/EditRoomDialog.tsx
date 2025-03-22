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
import { getRoomsTypes, updateRoom, addRoomType } from "../services/roomService"
import RoomType from "@/modules/core/models/roomType"
import { toast } from "sonner"
import { ComboboxCreate } from "../../../core/components/Combobox/ComboboxCreate"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	room: Room
}

const formSchema = z.object({
	name: z.string().nonempty({
		message: "El nombre no puede estar vacío",
	}),
	capacity: z.number().int().min(1, {
		message: "La capacidad debe ser mayor a 0",
	}),
	type: z.object({
		id: z.number().optional(),
		name: z.string().nonempty({
			message: "El tipo de la sala no puede estar vacío",
		}),
	}),
})

export default function EditRoomDialog({ open, onClose, room }: Props) {
	const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			capacity: 0,
			type: {
				name: "",
			},
		},
	})

	const handleOnCreateOption = async (option: { key: number; value: string }) => {
		await addRoomType(option.value)
		fetchRoomTypes()
	}

	const fetchRoomTypes = async () => {
		const res = await getRoomsTypes()
		setRoomTypes(res.data)
	}

	useEffect(() => {
		fetchRoomTypes()
		if (room) {
			form.reset({
				name: room.name,
				capacity: room.capacity,
				type: {
					name: room.type.name,
					id: room.type.id,
				},
			})
		}
	}, [form, room])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedRoom: Room = {
				id: room?.id!,
				name: values.name,
				capacity: values.capacity,
				type: {
					id: values.type.id!,
					name: values.type.name,
				},
			}

			await updateRoom(updatedRoom)

			toast.success("Sala actualizada exitosamente")

			onClose(false)
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.message) {
				toast.error(error.response.data.message)
			} else {
				toast.error("Error al actualizar la sala")
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Sala</DialogTitle>
					<DialogDescription>Puedes editar los siguientes atributos de la sala</DialogDescription>
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
								name="type.name"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Tipo de sala</FormLabel>
										<FormControl>
											<ComboboxCreate
												options={roomTypes.map((roomType) => ({
													key: roomType.id,
													value: roomType.name,
												}))}
												onCreateOption={handleOnCreateOption}
												placeholderText={field.value}
												itemName="tipo de sala"
												onChange={(selected) => {
													if (selected) {
														field.onChange(selected.value)
														form.setValue("type.id", selected.key)
													}
												}}
												selectedValue={field.value}
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Capacidad</FormLabel>
										<FormControl>
											<Input
												id="capacity"
												placeholder="Capacidad"
												type="number"
												className="col-span-3 m-0"
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
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
