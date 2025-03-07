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
import { toast } from "sonner"
import User from "@/modules/core/models/user"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { } from "../services/rubricTemplateService"
import Course from "@/modules/core/models/course"
import { getCourses } from "../../../admin/courses/services/courseService"
import RubricTemplate from "@/modules/core/models/rubricTemplate"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
}

const formSchema = z.object({
	title: z.string().nonempty({
        message: "Debe seleccionar la asignatura asociada",
    }),
})


export default function CreateRubricTemplateDialog({ open, onClose }: Props) {

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	})

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 10, "", "name", true)
			//setCourses(res.data)
		}

		fetchCourses()

		form.reset()
	}, [form, open])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		
        try {
			//await createRubricTemplate({})

			onClose(false)

			toast.success("Rubrica creada correctamente")
		} catch (error) {
			toast.error("Error al crear la rubrica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear Rubrica</DialogTitle>
					<DialogDescription>Ingreasa los siguientes atributos de la rubrica</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="grid gap-4 py-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Titulo</FormLabel>
										<FormControl>
											<Input id="id" placeholder="ID" className="col-span-3 m-0" {...field} />
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
