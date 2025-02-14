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
import { addRoomType } from "../services/roomService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
})

export default function AddRoomTypeDialog({ open, onClose }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await addRoomType(values.name)
			console.log("Tipo de sala creado exitosamente:", values.name)

			toast.success("Tipo de sala creado exitosamente")

			onClose(false)
		} catch (error) {
			toast.error("Error al crear el tipo de sala")
			console.error("Error al crear el tipo de sala:", error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Agregar Tipo de Sala</DialogTitle>
					<DialogDescription>Puedes agregar un nuevo tipo de sala con el siguiente nombre</DialogDescription>
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
