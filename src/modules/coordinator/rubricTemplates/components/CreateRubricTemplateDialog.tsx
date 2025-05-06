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
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { createRubricTemplate, getRubricTemplates } from "../services/rubricTemplateService"
import { RubricFormItem } from "./RubricFormItem"
import { rubricValidation } from "../lib/utils"
import RubricTemplate from "@/modules/core/models/rubricTemplate"

const animatedComponents = makeAnimated()

interface Props {
	open: boolean
	onClose: (open: boolean) => void
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
	.superRefine(rubricValidation)

const defaultRubric = {
	columns: [
		{
			rubricColumnId: Date.now() + 1,
			title: "No aprobado",
			scoringScale: {
				lowerValue: 0,
				upperValue: 3,
			},
		},
		{
			rubricColumnId: Date.now() + 2,
			title: "Aprobado",
			scoringScale: {
				lowerValue: 3,
				upperValue: 5,
			},
		},
	],
	criteria: [
		{
			criteriaId: Date.now() + 1,
			name: "A",
			weight: 50,
			scoringScaleDescription: ["Descripción", "Descripción"],
		},
		{
			criteriaId: Date.now() + 2,
			name: "B",
			weight: 50,
			scoringScaleDescription: ["Descripción", "Descripción"],
		},
	],
}

export default function CreateRubricTemplateDialog({ open, onClose }: Props) {
	const [courses, setCourses] = useState<{ value: number; label: string }[]>([])
	const [coursesFilter, setCoursesFilter] = useState<string>("")
	const [rubrics, setRubrics] = useState<RubricTemplate[]>([])
	const [rubricFilter, setRubricFilter] = useState<string>("")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			courses: [],
			rubric: defaultRubric,
		},
	})

	useEffect(() => {
		form.reset()
	}, [open, form])

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 20, coursesFilter, "name", true)
			setCourses(res.data.map((course) => ({ value: course.courseId!, label: course.name })))
		}

		fetchCourses()
	}, [open, coursesFilter])

	useEffect(() => {
		const fetchRubrics = async () => {
			const { data } = await getRubricTemplates(0, 20, rubricFilter, "title", true)
			setRubrics(data)
		}

		fetchRubrics()
	}, [rubricFilter, open])

	const selectRubric = (rubric: RubricTemplate) => {
		form.setValue("rubric", {
			columns: rubric.columns.map((column, index) => ({
				rubricColumnId: Date.now() + index,
				...column,
			})),
			criteria: rubric.criteria.map((criteria, index) => ({
				criteriaId: Date.now() + index,
				...criteria,
			})),
		})
	}

	const unselectRubric = () => {
		form.setValue("rubric", {
			columns: defaultRubric.columns.map((column, index) => ({
				...column,
				rubricColumnId: Date.now() + index,
			})),
			criteria: defaultRubric.criteria.map((criteria, index) => ({
				...criteria,
				criteriaId: Date.now() + index,
			})),
		})
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await createRubricTemplate({
				title: values.title,
				courses: values.courses.map((course) => course.value),
				columns: values.rubric.columns.map((column) => ({
					title: column.title,
					scoringScale: column.scoringScale,
				})),
				criteria: values.rubric.criteria.map((column) => ({
					name: column.name,
					weight: column.weight,
					scoringScaleDescription: column.scoringScaleDescription,
				})),
				archived: false,
			})

			onClose(false)

			toast.success("Rúbrica creada exitosamente")
		} catch (error) {
			console.error(error)
			toast.error("Error al crear la rúbrica")
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
								filter={rubricFilter}
								setFilter={setRubricFilter}
								options={rubrics.map((rubric) => ({
									key: rubric.rubricTemplateId!,
									value: rubric.title,
								}))}
								itemName="rúbrica"
								onChange={(selectedRubric) => {
									if (!selectedRubric) {
										unselectRubric()
										return
									}

									selectRubric(
										rubrics.find((rubric) => rubric.rubricTemplateId === selectedRubric?.key)!
									)
								}}
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
												placeholder="Seleccionar asignaturas"
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
												noOptionsMessage={() => "No se encontraron asignaturas"}
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
							render={() => (
								<RubricFormItem
									getRubric={() => form.getValues("rubric")}
									control={form.control}
									setRubric={(rubric) => form.setValue("rubric", rubric, { shouldDirty: true })}
								/>
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
