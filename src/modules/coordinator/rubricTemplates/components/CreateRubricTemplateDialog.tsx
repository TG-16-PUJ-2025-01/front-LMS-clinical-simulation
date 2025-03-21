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
import Select from "react-select"
import { Textarea } from "@/modules/core/components/ui/textarea"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
}

const formSchema = z
	.object({
		title: z.string().nonempty({
			message: "El título es obligatorio",
		}),
		courses: z
			.array(
				z.object({
					value: z.number(),
					label: z.string(),
				})
			)
			.nonempty({
				message: "Debe seleccionar al menos un curso",
			}),
		rubric: z.object({
			columns: z.array(
				z.object({
					id: z.number(),
					title: z.string(),
					scoringScale: z.object({
						min: z.coerce.number(),
						max: z.coerce.number(),
					}),
				})
			),
			criteria: z.array(
				z.object({
					id: z.number(),
					name: z.string(),
					description: z.string(),
					weight: z.coerce.number(),
					scoringDescription: z.array(z.string()),
				})
			),
		}),
	})
	.superRefine(({ rubric }, ctx) => {
		const totalWeight = rubric.criteria.reduce((sum, criteria) => sum + criteria.weight, 0)
		if (totalWeight !== 100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "El peso total de los criterios debe ser igual a 100%",
				path: ["rubric"],
			})
		}

		if (rubric.columns.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "La rúbrica debe tener al menos una columna",
				path: ["rubric"],
			})
		}

		if (rubric.criteria.length < 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "La rúbrica debe tener al menos un criterio",
				path: ["rubric"],
			})
		}

		const hasInvalidScoringScale = rubric.columns.some(
			(column) => column.scoringScale.min > column.scoringScale.max
		)
		if (hasInvalidScoringScale) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "El puntaje mínimo no puede ser mayor al puntaje máximo",
				path: ["rubric"],
			})
		}

		const hasOverlappingScoringScale = rubric.columns.some((column, index) =>
			rubric.columns.some(
				(otherColumn, otherIndex) =>
					index !== otherIndex &&
					column.scoringScale.min < otherColumn.scoringScale.max &&
					column.scoringScale.max > otherColumn.scoringScale.min
			)
		)

		if (hasOverlappingScoringScale) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Los rangos de puntaje no pueden superponerse",
				path: ["rubric"],
			})
		}

		const hasEmptyScoringDescription = rubric.criteria.some((criteria) =>
			criteria.scoringDescription.some((description) => description === "")
		)
		if (hasEmptyScoringDescription) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Todas las celdas de la rúbrica deben tener descripción",
				path: ["rubric"],
			})
		}

		const hasEmptyCriteriaName = rubric.criteria.some((criteria) => criteria.name === "")

		if (hasEmptyCriteriaName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Todos los criterios deben tener nombre",
				path: ["rubric"],
			})
		}

		const hasEmptyColumnTitle = rubric.columns.some((column) => column.title === "")

		if (hasEmptyColumnTitle) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Todas las columnas deben tener título",
				path: ["rubric"],
			})
		}
	})

export default function CreateRubricTemplateDialog({ open, onClose }: Props) {
	const [colId, setColId] = useState<number>(3)
	const [criteriaId, setCriteriaId] = useState<number>(3)
	const [numCols, setNumCols] = useState<number>(2)
	const [courses, setCourses] = useState<{ value: number; label: string }[]>([])

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
						weight: 50,
						scoringDescription: ["Descripción", "Descripción"],
					},
					{
						id: 2,
						name: "B",
						description: "",
						weight: 50,
						scoringDescription: ["Descripción", "Descripción"],
					},
				],
			},
		},
	})

	const deleteColumn = (id: number) => {
		const currentRubric = form.getValues("rubric")

		if (currentRubric.columns.length === 1) {
			return
		}

		let index = -1

		// Remove column
		const newColumns = currentRubric.columns.filter((col) => {
			if (col.id !== id) {
				index++
				return true
			}
		})

		// Update each criteria's scoring scale and descriptions
		const updatedCriteria = currentRubric.criteria.map((criteria) => ({
			...criteria,
			scoringDescription: criteria.scoringDescription.filter((_, idx) => idx !== index),
		}))

		form.setValue(
			"rubric",
			{
				columns: newColumns,
				criteria: updatedCriteria,
			},
			{ shouldDirty: true }
		)

		setNumCols((prev) => prev - 1)
	}

	const deleteCriteria = (id: number) => {
		const currentRubric = form.getValues("rubric")

		if (currentRubric.criteria.length === 1) {
			return
		}

		// Remove criteria
		const newCriteria = currentRubric.criteria.filter((criteria) => criteria.id !== id)

		form.setValue(
			"rubric",
			{
				columns: currentRubric.columns,
				criteria: newCriteria,
			},
			{ shouldDirty: true }
		)
	}

	const addColumn = (id: number, where: "left" | "right" = "left") => {
		const currentRubric = form.getValues("rubric")

		let index = currentRubric.columns.findIndex((col) => col.id === id)

		index = where === "left" ? index : index + 1

		const newColumns = [
			...currentRubric.columns.slice(0, index),
			{
				id: colId,
				title: "Columna " + colId,
				scoringScale: { min: 0, max: 5 },
			},
			...currentRubric.columns.slice(index),
		]

		const updatedCriteria = currentRubric.criteria.map((criteria) => ({
			...criteria,
			scoringDescription: [
				...criteria.scoringDescription.slice(0, index),
				"Descripción",
				...criteria.scoringDescription.slice(index),
			],
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
	}

	const addCriteria = (id: number, where: "above" | "below" = "above") => {
		const currentRubric = form.getValues("rubric")
		let index = currentRubric.criteria.findIndex((criteria) => criteria.id === id)

		index = where === "above" ? index : index + 1

		const newCriteria = {
			id: criteriaId,
			name: String.fromCharCode(65 + currentRubric.criteria.length), // Generates next letter (A, B, C...)
			description: "",
			weight: 0,
			scoringDescription: Array<string>(currentRubric.columns.length).fill("Descripción"),
		}

		const updatedCriteria = [
			...currentRubric.criteria.slice(0, index),
			newCriteria,
			...currentRubric.criteria.slice(index),
		]

		form.setValue(
			"rubric",
			{
				columns: currentRubric.columns,
				criteria: updatedCriteria,
			},
			{ shouldDirty: true }
		)

		setCriteriaId((prev) => prev + 1)
	}

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 10, "", "name", true)
			setCourses(res.data.map((course) => ({ value: course.courseId!, label: course.name })))
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
			<DialogContent className="max-h-screen sm:max-w-[1200px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Crear Rúbrica</DialogTitle>
					<DialogDescription>
						Para más opciones en la rúbrica, oprima <span className="font-bold">click derecho</span>{" "}
						sobre cualquier celda
					</DialogDescription>
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
							<FormField
								control={form.control}
								name="courses"
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="m-0 text-right">Cursos</FormLabel>
										<FormControl className="col-span-3">
											<Select
												components={animatedComponents}
												isMulti
												options={courses}
												value={field.value}
												onChange={(selected) => field.onChange(selected)}
												placeholder="Seleccionar cursos"
												className="w-full"
											/>
										</FormControl>
										<FormMessage className="col-span-4 m-0 -mt-2 text-right" />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="rubric"
							render={({ field }) => (
								<FormItem className="flex max-w-full flex-col gap-2">
									<FormControl>
										<section className="flex max-w-[92vw] flex-col gap-2 xl:max-w-[1152px]">
											<div className="flex h-full w-full gap-2">
												<article className="max-h-[60vh] flex-1 overflow-auto rounded-md border">
													<Table className="h-full w-full">
														<TableHeader>
															<TableRow>
																<TableHead className="w-[100px] border py-1 align-top">
																	Criterios
																</TableHead>
																<TableHead className="w-20 min-w-20 border py-1 align-top">
																	Peso
																</TableHead>
																{field.value.columns.map((column, index) => (
																	<TableHead
																		key={column.id}
																		className="text-accent-foreground border py-1"
																	>
																		<ContextMenu>
																			<ContextMenuTrigger className="flex h-full w-full grow flex-col">
																				<FormField
																					control={form.control}
																					name={`rubric.columns.${index}.title`}
																					render={({ field }) => (
																						<FormItem className="flex flex-col gap-2">
																							<FormControl>
																								<Textarea
																									className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																									style={{
																										maxWidth: `calc((100vw - 176px) / ${numCols})`,
																									}}
																									{...field}
																								/>
																							</FormControl>
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
																			</ContextMenuTrigger>
																			<CustomContextMenuContent
																				colActions={{
																					id: column.id,
																					add: addColumn,
																					delete: deleteColumn,
																					deleteDisabled: field.value.columns.length === 1,
																				}}
																			/>
																		</ContextMenu>
																	</TableHead>
																))}
															</TableRow>
														</TableHeader>
														<TableBody>
															{field.value.criteria.map((criteria, index) => (
																<TableRow key={criteria.id}>
																	<TableCell className="border font-medium">
																		<ContextMenu>
																			<ContextMenuTrigger className="flex h-full w-full grow flex-col">
																				<FormField
																					control={form.control}
																					name={`rubric.criteria.${index}.name`}
																					render={({ field }) => (
																						<FormItem className="flex flex-col gap-2">
																							<FormControl>
																								<Textarea
																									className="h-full min-h-min w-2 max-w-[100px] min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																									{...field}
																								/>
																							</FormControl>
																						</FormItem>
																					)}
																				/>
																			</ContextMenuTrigger>
																			<CustomContextMenuContent
																				rowActions={{
																					id: criteria.id,
																					add: addCriteria,
																					delete: deleteCriteria,
																					deleteDisabled:
																						form.getValues("rubric").criteria.length === 1,
																				}}
																			/>
																		</ContextMenu>
																	</TableCell>
																	<TableCell className="border font-medium">
																		<ContextMenu>
																			<ContextMenuTrigger className="flex h-full w-full grow">
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
																									className="h-full min-h-min w-full max-w-[100px] resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																									{...field}
																								/>
																							</FormControl>
																						</FormItem>
																					)}
																				/>
																				<span>%</span>
																			</ContextMenuTrigger>
																			<CustomContextMenuContent
																				rowActions={{
																					id: criteria.id,
																					add: addCriteria,
																					delete: deleteCriteria,
																					deleteDisabled:
																						form.getValues("rubric").criteria.length === 1,
																				}}
																			/>
																		</ContextMenu>
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
																										className="h-full min-h-fit min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																										style={{
																											maxWidth: `calc((100vw - 176px) / ${numCols})`,
																										}}
																										{...field}
																									/>
																								</FormControl>
																							</FormItem>
																						)}
																					/>
																				</ContextMenuTrigger>
																				<CustomContextMenuContent
																					colActions={{
																						id: field.value.columns[index2].id,
																						add: addColumn,
																						delete: deleteColumn,
																						deleteDisabled: field.value.columns.length === 1,
																					}}
																					rowActions={{
																						id: criteria.id,
																						add: addCriteria,
																						delete: deleteCriteria,
																						deleteDisabled:
																							form.getValues("rubric").criteria.length === 1,
																					}}
																				/>
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

interface CustomContextMenuContentProps {
	colActions?: {
		id: number
		add: (index: number, where: "left" | "right") => void
		delete: (index: number) => void
		deleteDisabled: boolean
	}
	rowActions?: {
		id: number
		add: (index: number, where: "above" | "below") => void
		delete: (index: number) => void
		deleteDisabled: boolean
	}
}

function CustomContextMenuContent({ colActions, rowActions }: CustomContextMenuContentProps) {
	return (
		<ContextMenuContent className="w-64">
			<ContextMenuSub>
				<ContextMenuSubTrigger inset>Insertar</ContextMenuSubTrigger>
				<ContextMenuSubContent className="w-48">
					{rowActions && (
						<>
							<ContextMenuItem onClick={() => rowActions.add(rowActions.id, "above")}>
								Fila encima
							</ContextMenuItem>
							<ContextMenuItem onClick={() => rowActions.add(rowActions.id, "below")}>
								Fila debajo
							</ContextMenuItem>
						</>
					)}

					{rowActions && colActions && <ContextMenuSeparator />}
					{colActions && (
						<>
							<ContextMenuItem onClick={() => colActions.add(colActions.id, "left")}>
								Columna a la izquierda
							</ContextMenuItem>
							<ContextMenuItem onClick={() => colActions.add(colActions.id, "right")}>
								Columna a la derecha
							</ContextMenuItem>
						</>
					)}
				</ContextMenuSubContent>
			</ContextMenuSub>
			<ContextMenuSub>
				<ContextMenuSubTrigger inset>Eliminar</ContextMenuSubTrigger>
				<ContextMenuSubContent className="w-48">
					{rowActions && (
						<ContextMenuItem
							onClick={() => rowActions.delete(rowActions.id)}
							disabled={rowActions.deleteDisabled}
						>
							Fila
						</ContextMenuItem>
					)}
					{colActions && (
						<ContextMenuItem
							onClick={() => colActions.delete(colActions.id)}
							disabled={colActions.deleteDisabled}
						>
							Columna
						</ContextMenuItem>
					)}
				</ContextMenuSubContent>
			</ContextMenuSub>
		</ContextMenuContent>
	)
}
