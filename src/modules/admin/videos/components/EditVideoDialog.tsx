import DatePicker from "@/modules/core/components/DatePicker"
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
import Video from "@/modules/core/models/video"
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
import { useEffect } from "react"
import { updateVideo } from "../services/videoService"
import { toast } from "sonner"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	video?: Video
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: "El nombre debe tener al menos 2 caracteres",
	}),
	expirationDate: z.date({
		message: "La fecha de expiración es requerida",
	}),
})

export default function EditVideoDialog({ open, onClose, video }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: undefined,
			expirationDate: undefined,
		},
	})

	useEffect(() => {
		form.reset({
			name: video?.name,
			expirationDate: video?.expirationDate,
		})
	}, [form, video])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await updateVideo(video!.videoId, values)
			toast.success("Video actualizado")
		} catch (error) {
			toast.error("Error al actualizar el video")
		}
		onClose(false)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Video</DialogTitle>
					<DialogDescription>Puedes editar los siguientes atributos del video</DialogDescription>
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
								name="expirationDate"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Fecha de expiración</FormLabel>
										<FormControl>
											<DatePicker
												id="expirationDate"
												className="col-span-3 m-0"
												selected={field.value}
												onSelect={(date) => field.onChange(date ?? null)}
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
