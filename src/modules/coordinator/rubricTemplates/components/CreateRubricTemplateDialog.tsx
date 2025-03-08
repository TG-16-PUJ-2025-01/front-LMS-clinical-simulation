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
		message: "EL título es obligatorio",
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

	rubric: z.object({
		columns: z.array(
			z.string().min(1, {
				message: "Debes ingresar nombre a la columna",
			})
		),
		criteria: z.array(
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
	}),
})

export default function CreateRubricTemplateDialog({ open, onClose }: Props) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			courses: [],
			rubric: {
				columns: ["Aprobado", "No aprobado"],
				criteria: [
					{
						name: "A",
						description: "",
						points: 0,
						scoringScale: [
							{
								min: 0,
								max: 3,
							},
						],
						scoringScaleDescription: [""],
					},
					{
						name: "B",
						description: "",
						points: 0,
						scoringScale: [
							{
								min: 3,
								max: 4,
							},
						],
						scoringScaleDescription: [""],
					},
				],
			},
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
					<DialogTitle>Crear Rúbrica</DialogTitle>
					<DialogDescription>Ingresa los siguientes atributos de la rúbrica</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<Form {...form}>
						<div className="flex gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-2">
										<FormControl>
											<Input id="id" placeholder="Título" className="col-span-3 m-0" {...field} />
										</FormControl>
										<FormMessage className="m-0 -mt-2" />
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
						<FormField
							control={form.control}
							name="rubric"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormControl>
										<section className="flex flex-col gap-2">
											<div className="flex h-full w-full gap-2">
												<article className="flex-1 overflow-auto rounded-md border">
													<Table className="h-full">
														<TableHeader>
															<TableRow>
																<TableHead className="w-[100px] border">Criterios</TableHead>
																{field.value.columns.map((column, index) => (
																	<TableHead key={index} className="border">{column}</TableHead>
																))}
															</TableRow>
														</TableHeader>
														<TableBody>
															<TableRow>
																<TableCell className="font-medium">
																	Unicornios por doquier
																</TableCell>
																<TableCell>Unicornios por doquier</TableCell>
																<TableCell>Unicornios por doquier</TableCell>
															</TableRow>
															<TableRow>
																<TableCell className="font-medium">
																	Unicornios por doquier
																</TableCell>
																<TableCell>Unicornios por doquier</TableCell>
																<TableCell>Unicornios por doquier</TableCell>
															</TableRow>
														</TableBody>
													</Table>
												</article>
												<div className="flex flex-col">
													<Button
														type="button"
														variant="ghost"
														className="h-full flex-grow rounded-md border px-1"
													>
														+
													</Button>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												className="flex h-5 w-[calc(100%-28px)] items-center justify-center rounded-md border"
											>
												+
											</Button>
										</section>
									</FormControl>
									<FormMessage className="m-0 -mt-2" />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit" className="mt-4">
								Crear
							</Button>
						</DialogFooter>
					</Form>
				</form>
			</DialogContent>
		</Dialog>
	)
}
