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
import { useEffect } from "react"
import { toast } from "sonner"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import {} from "../services/rubricTemplateService"
import { getCourses } from "../../../admin/courses/services/courseService"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
}

const formSchema = z.object({
	title: z.string().nonempty({
		message: "Debes seleccionar la asignatura asociada",
	}),
	courses: z
		.array(
			z.object({
				id: z.number(),
				name: z.string().min(1, {
					message: "Debes ingresar una descripción",
				}),
			})
		)
		.nonempty({
			message: "Debes seleccionar al menos una asignatura",
		}),

	rubric: z.array(
		z.object({
			name: z.string().min(1, {
				message: "Debes ingresar una descripción",
			}),
			description: z.string().min(1, {
				message: "Debes ingresar una descripción",
			}),
			points: z.number().int().positive({
				message: "Debes ingresar una cantidad máxima de puntos válida",
			}),
			scoringScale: z.array(
				z.object({
					min: z.number().int().positive({
						message: "Debes ingresar una cantidad máxima de puntos válida",
					}),
					max: z.number().int().positive({
						message: "Debes ingresar una cantidad máxima de puntos válida",
					}),
				})
			),
			scoringScaleDescription: z.array(
				z.string().min(1, {
					message: "Debes ingresar una descripción",
				})
			),
		})
	),
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
			console.error(error)
			toast.error("Error al crear la rubrica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[1200px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear Rubrica</DialogTitle>
					<DialogDescription>Ingreasa los siguientes atributos de la rubrica</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Form {...form}>
						<div className="flex gap-4">
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
							<Combobox
								className="min-w-48"
								placeholderText="Buscar rúbrica"
								options={[
									{
										value: "a",
									},
									{
										value: "b",
									},
									{
										value: "c",
									},
									{
										value: "d",
									},
								]}
								itemName="rúbrica"
								onChange={(selected) => {}}
							/>
						</div>
						<section className="flex flex-col gap-2">
							<div className="flex h-[100px] w-full gap-2">
								<article className="flex-1 overflow-auto rounded-md border">
									<Table className="h-full">
										<TableHeader>
											<TableRow>
												<TableHead className="w-[100px]">Invoice</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Method</TableHead>
												<TableHead className="text-right">Amount</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell className="font-medium">Unicornios por doquier</TableCell>
												<TableCell>Unicornios por doquier</TableCell>
												<TableCell>Unicornios por doquier</TableCell>
												<TableCell className="text-right">Unicornios por doquier</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</article>
								<Button
									variant="ghost"
									className="flex h-full items-center justify-center rounded-md border px-1"
								>
									+
								</Button>
							</div>
							<Button
								variant="ghost"
								className="flex w-[calc(100%-28px)] items-center justify-center rounded-md border h-5"
							>
								+
							</Button>
						</section>

						<DialogFooter>
							<Button type="submit">Crear</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
