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
	FormMessage,
} from "@/modules/core/components/ui/form"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { getCourses } from "../../../admin/courses/services/courseService"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { createRubricTemplate } from "../services/rubricTemplateService"
import { RubricFormItem } from "./RubricFormItem"

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
					rubricColumnId: z.number().optional(),
					title: z.string(),
					scoringScale: z.object({
						lowerValue: z.coerce.number(),
						upperValue: z.coerce.number(),
					}),
				})
			),
			criteria: z.array(
				z.object({
					criteriaId: z.number().optional(),
					name: z.string(),
					weight: z.coerce.number(),
					scoringScaleDescription: z.array(z.string()),
				})
			),
		}),
	})
	.superRefine(({ rubric }, ctx) => {
		const totalWeight = rubric.criteria.reduce((sum, criteria) => sum + criteria.weight, 0)
		if (totalWeight !== 100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "La suma de pesos de los criterios debe ser igual a 100%",
				path: ["rubric"],
			})
		}

		const numEmptyWeights = rubric.criteria.filter((criteria) => criteria.weight === 0).length

		if (numEmptyWeights > 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Todos los criterios deben tener un peso positivo",
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
			(column) => column.scoringScale.lowerValue > column.scoringScale.upperValue
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
					column.scoringScale.lowerValue < otherColumn.scoringScale.upperValue &&
					column.scoringScale.upperValue > otherColumn.scoringScale.lowerValue
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
			criteria.scoringScaleDescription.some((description) => description === "")
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
	const [courses, setCourses] = useState<{ value: number; label: string }[]>([])
	const [coursesFilter, setCoursesFilter] = useState<string>("")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			courses: [],
			rubric: {
				columns: [
					{
						rubricColumnId: 1,
						title: "No aprobado",
						scoringScale: {
							lowerValue: 0,
							upperValue: 3,
						},
					},
					{
						rubricColumnId: 2,
						title: "Aprobado",
						scoringScale: {
							lowerValue: 3,
							upperValue: 5,
						},
					},
				],
				criteria: [
					{
						criteriaId: 1,
						name: "A",
						weight: 50,
						scoringScaleDescription: ["Descripción", "Descripción"],
					},
					{
						criteriaId: 2,
						name: "B",
						weight: 50,
						scoringScaleDescription: ["Descripción", "Descripción"],
					},
				],
			},
		},
	})

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 1000, coursesFilter, "name", true)
			setCourses(res.data.map((course) => ({ value: course.courseId!, label: course.name })))
		}

		fetchCourses()

		form.reset()
	}, [form, open, coursesFilter])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await createRubricTemplate({
				title: values.title,
				courses: values.courses.map((course) => course.value),
				columns: values.rubric.columns,
				criteria: values.rubric.criteria,
				archived: false,
			})

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
									<FormItem>
										<FormControl>
											<Select
												components={animatedComponents}
												isMulti
												options={courses}
												value={field.value}
												onChange={(selected) => field.onChange(selected)}
												placeholder="Seleccionar cursos"
												classNamePrefix="react-select"
												className="w-full min-w-40 rounded-md p-0"
												styles={{
													control: (baseStyles) => ({
														...baseStyles,
														"borderColor": "",
														"borderRadius": "var(--radius-md)",
														"boxShadow": "",
														"&:hover": { borderColor: "" },
														"&:focus": { borderColor: "black" },
													}),
												}}
												classNames={{
													control: () =>
														"flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:shadow-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
												}}
												onInputChange={(input) => setCoursesFilter(input)}
												noOptionsMessage={() => "No se encontraron cursos"}
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
								<RubricFormItem form={form} field={field} />
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
