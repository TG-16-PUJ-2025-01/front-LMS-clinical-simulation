import { Button } from "@/modules/core/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/modules/core/components/ui/form"
import { Textarea } from "@/modules/core/components/ui/textarea"
import { formatTimestamp } from "@/modules/core/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface Props {
	timestamp: number
}

const FormSchema = z.object({
	description: z.string().max(500, {
		message: "Un comentario no puede tener más de 500 caracteres",
	}),
})

export function CommentForm({ timestamp }: Props) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast.success("Form submitted")
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full space-y-6">
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel className="flex flex-col gap-2">
									<p>Nuevo Comentario</p>
									<p className="text-sm text-gray-400">
										Comentario en el instante: {formatTimestamp(timestamp)}
									</p>
								</FormLabel>
								<Button type="submit">Guardar</Button>
							</div>
							<FormControl>
								<Textarea
									placeholder="Escribe un comentario..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
