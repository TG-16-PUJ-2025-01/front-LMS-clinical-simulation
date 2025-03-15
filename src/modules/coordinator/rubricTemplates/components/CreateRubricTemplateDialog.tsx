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
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
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
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/modules/core/components/ui/context-menu"
import { Textarea } from "@/modules/core/components/ui/textarea"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
}

const formSchema = z.object({
	title: z.string().nonempty({
		message: "El título es obligatorio",
	}),
	courses: z
		.array(
			z.object({
				id: z.number().optional(),
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
			z.object({
				id: z.number().optional(),
				title: z.string().min(1),
				scoringScale: z.object({
					min: z.coerce.number().min(0).max(5),
					max: z.coerce.number().min(0).max(5),
				}),
			})
		),
		criteria: z.array(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1),
				description: z.string().min(1),
				weight: z.coerce.number().positive().max(100),
				scoringDescription: z.array(z.string().min(1)),
			})
		),
	}),
})

export default function CreateRubricTemplateDialog({ open, onClose }: Props) {
	const [colId, setColId] = useState<number>(3)
	const [criteriaId, setCriteriaId] = useState<number>(3)
	const [numCols, setNumCols] = useState<number>(2)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			courses: [],
			rubric: {
				columns: [
					{
						id: 1,
						title: "No aprobado",
						scoringScale: {
							min: 0,
							max: 3,
						},
					},
					{
						id: 2,
						title: "Aprobado",
						scoringScale: {
							min: 3,
							max: 5,
						},
					},
				],
				criteria: [
					{
						id: 1,
						name: "A",
						description: "",
						weight: 100,
						scoringDescription: ["Descripción", "Descripción"],
					},
					{
						id: 2,
						name: "B",
						description: "",
						weight: 100,
						scoringDescription: ["Descripción", "Descripción"],
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
								placeholderText="Buscar rúbrica base"
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
								onChange={() => {}}
							/>
						</div>
						<FormField
							control={form.control}
							name="rubric"
							render={({ field }) => (
								<FormItem className="flex max-w-full flex-col gap-2">
									<FormControl>
										<section className="flex max-w-[calc(100vw-48px)] xl:max-w-[1152px] flex-col gap-2">
											<div className="flex h-full w-full gap-2">
												<article className="flex-1 overflow-auto rounded-md border">
													<Table className="h-full w-full">
														<TableHeader>
															<TableRow>
																<TableHead className="w-[100px] border py-1 align-top">
																	Criterios
																</TableHead>
																<TableHead className="w-16 border py-1 align-top">Peso</TableHead>
																{field.value.columns.map((column, index) => (
																	<TableHead key={column.id} className="border py-1">
																		<FormField
																			control={form.control}
																			name={`rubric.columns.${index}.title`}
																			render={({ field }) => (
																				<FormItem className="flex flex-col gap-2">
																					<FormControl>
																						<Textarea
																							className="h-full min-h-min min-w-full resize-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																							style={{
																								maxWidth: `calc((100vw - 176px) / ${numCols})`,
																							}}
																							{...field}
																						/>
																					</FormControl>
																					<FormMessage className="m-0 -mt-2" />
																				</FormItem>
																			)}
																		/>
																		<span className="text-blue-javeriana flex items-center gap-2 text-xs font-bold italic">
																			<FormField
																				control={form.control}
																				name={`rubric.columns.${index}.scoringScale.min`}
																				render={({ field }) => (
																					<FormItem className="flex items-baseline gap-2">
																						<FormLabel>Min</FormLabel>
																						<FormControl>
																							<Input
																								type="number"
																								min={0}
																								max={5}
																								className="field-sizing-content h-min w-fit px-2"
																								{...field}
																							/>
																						</FormControl>
																					</FormItem>
																				)}
																			/>
																			-
																			<FormField
																				control={form.control}
																				name={`rubric.columns.${index}.scoringScale.max`}
																				render={({ field }) => (
																					<FormItem className="flex items-baseline gap-2">
																						<FormLabel>Max</FormLabel>
																						<FormControl>
																							<Input
																								type="number"
																								min={0}
																								max={5}
																								className="field-sizing-content h-min w-fit px-2"
																								{...field}
																							/>
																						</FormControl>
																					</FormItem>
																				)}
																			/>
																			puntos
																		</span>
																	</TableHead>
																))}
															</TableRow>
														</TableHeader>
														<TableBody>
															{field.value.criteria.map((criteria, index) => (
																<TableRow key={criteria.id}>
																	<TableCell className="border font-medium">
																		<FormField
																			control={form.control}
																			name={`rubric.criteria.${index}.name`}
																			render={({ field }) => (
																				<FormItem className="flex flex-col gap-2">
																					<FormControl>
																						<Textarea
																							className="h-full min-h-min w-2 max-w-[100px] min-w-full resize-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																							{...field}
																						/>
																					</FormControl>
																					<FormMessage className="m-0 -mt-2" />
																				</FormItem>
																			)}
																		/>
																	</TableCell>
																	<TableCell className="border font-medium">
																		<FormField
																			control={form.control}
																			name={`rubric.criteria.${index}.weight`}
																			render={({ field }) => (
																				<FormItem className="inline-flex w-[calc(100%-1rem)] flex-col gap-2">
																					<FormControl>
																						<Input
																							type="number"
																							min={0}
																							max={100}
																							className="h-full min-h-min w-full max-w-[100px] resize-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																							{...field}
																						/>
																					</FormControl>
																				</FormItem>
																			)}
																		/>
																		<span>%</span>
																	</TableCell>
																	{criteria.scoringDescription.map((_, index2) => (
																		<TableCell
																			key={`${criteria.id}-${field.value.columns[index2].id}`}
																			className="border p-0"
																			style={{ width: `calc((100vw - 176px) / ${numCols})` }}
																		>
																			<ContextMenu>
																				<ContextMenuTrigger className="flex h-full w-full grow p-2">
																					<FormField
																						control={form.control}
																						name={`rubric.criteria.${index}.scoringDescription.${index2}`}
																						render={({ field }) => (
																							<FormItem className="flex w-full flex-col gap-2">
																								<FormControl>
																									<Textarea
																										className="h-full min-h-fit min-w-full resize-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																										style={{
																											maxWidth: `calc((100vw - 176px) / ${numCols})`,
																										}}
																										{...field}
																									/>
																								</FormControl>
																								<FormMessage className="m-0 -mt-2" />
																							</FormItem>
																						)}
																					/>
																				</ContextMenuTrigger>
																				<ContextMenuContent className="w-64">
																					<ContextMenuSub>
																						<ContextMenuSubTrigger inset>
																							Insertar
																						</ContextMenuSubTrigger>
																						<ContextMenuSubContent className="w-48">
																							<ContextMenuItem>Fila encima</ContextMenuItem>
																							<ContextMenuItem>Fila debajo</ContextMenuItem>
																							<ContextMenuSeparator />
																							<ContextMenuItem>
																								Columna a la izquierda
																							</ContextMenuItem>
																							<ContextMenuItem>
																								Columna a la derecha
																							</ContextMenuItem>
																						</ContextMenuSubContent>
																					</ContextMenuSub>
																					<ContextMenuSub>
																						<ContextMenuSubTrigger inset>
																							Eliminar
																						</ContextMenuSubTrigger>
																						<ContextMenuSubContent className="w-48">
																							<ContextMenuItem>Fila</ContextMenuItem>
																							<ContextMenuItem>Columna</ContextMenuItem>
																						</ContextMenuSubContent>
																					</ContextMenuSub>
																				</ContextMenuContent>
																			</ContextMenu>
																		</TableCell>
																	))}
																</TableRow>
															))}
														</TableBody>
													</Table>
												</article>
												<div className="flex flex-col">
													<Button
														type="button"
														variant="ghost"
														className="h-full flex-grow rounded-md border px-1"
														onClick={() => {
															const currentRubric = form.getValues("rubric")

															// Add new column
															const newColumns = [
																...currentRubric.columns,
																{
																	title: "Columna " + colId,
																	id: colId,
																	scoringScale: { min: 0, max: 5 },
																},
															]

															// Update each criteria's scoring scale and descriptions
															const updatedCriteria = currentRubric.criteria.map((criteria) => ({
																...criteria,
																scoringDescription: [...criteria.scoringDescription, "Descripción"],
															}))

															form.setValue(
																"rubric",
																{
																	columns: newColumns,
																	criteria: updatedCriteria,
																},
																{ shouldDirty: true }
															)

															setColId((prev) => prev + 1)
															setNumCols((prev) => prev + 1)
														}}
													>
														+
													</Button>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												className="flex h-5 w-[calc(100%-28px)] items-center justify-center rounded-md border"
												onClick={() => {
													const currentRubric = form.getValues("rubric")
													const columnsCount = currentRubric.columns.length

													const newCriteria = {
														id: criteriaId,
														name: String.fromCharCode(65 + currentRubric.criteria.length), // Generates next letter (A, B, C...)
														description: "",
														weight: 0,
														scoringDescription: Array<string>(columnsCount).fill("Descripción"),
													}

													form.setValue(
														"rubric",
														{
															...currentRubric,
															criteria: [...currentRubric.criteria, newCriteria],
														},
														{ shouldDirty: true }
													)

													setCriteriaId((prev) => prev + 1)
												}}
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
