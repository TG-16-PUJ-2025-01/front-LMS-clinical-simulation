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
import { getRoomsTypes, createRoom, addRoomType } from "../services/roomService"
import RoomType from "@/modules/core/models/roomType"
import { toast } from "sonner"
import { ComboboxCreate } from "../../../core/components/Combobox/ComboboxCreate"
import RoomTypeDto from "../dtos/roomTypeDto"
import RoomDto from "../dtos/roomDto"
import { NumericFormat } from "react-number-format"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
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

export default function AddRoomDialog({ open, onClose }: Props) {
	const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			capacity: 0,
			type: {
				id: undefined,
				name: "",
			},
		},
	})

	const handleOnCreateOption = async (value: string) => {
		const newRoomType: RoomTypeDto = { name: value }
		const response = await addRoomType(newRoomType)
		const createdRoomType = response.data
		form.setValue("type", { id: createdRoomType.id, name: createdRoomType.name })
		fetchRoomTypes()
	}

	const fetchRoomTypes = async () => {
		const res = await getRoomsTypes()
		setRoomTypes(res.data)
	}

	useEffect(() => {
		if (open) {
			fetchRoomTypes()
			form.reset()
		}
	}, [form, open])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const newRoom: RoomDto = {
				name: values.name,
				capacity: values.capacity,
				typeId: values.type.id!,
			}

			await createRoom(newRoom)

			onClose(false)

			toast.success("Sala creada exitosamente")

		} catch (error: any) {
			toast.error("El nombre de la sala ya existe")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Agregar Sala</DialogTitle>
					<DialogDescription>
						Puedes agregar una nueva sala con los siguientes atributos
					</DialogDescription>
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
												placeholderText="Seleccionar..."
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
											<NumericFormat
												value={field.value}
												onValueChange={(e) => field.onChange(e.floatValue)}
												thousandSeparator={false}
												allowNegative={false}
												customInput={Input}
												placeholder="Capacidad"
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
