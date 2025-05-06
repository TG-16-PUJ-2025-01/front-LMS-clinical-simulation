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
import { getCoursesByRubricTemplate, updateRubricTemplate } from "../services/rubricTemplateService"
import { getCourses } from "../../../admin/courses/services/courseService"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { rubricValidation } from "../lib/utils"
import Select from "react-select"
import { RubricFormItem } from "./RubricFormItem"
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

export default function EditRubricTemplateDialog({ open, onClose, rubricTemplateData }: Props) {
	const [courses, setCourses] = useState<{ value: number; label: string }[]>([])
	const [coursesFilter, setCoursesFilter] = useState<string>("")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			courses: [],
			rubric: {
				columns: [],
				criteria: [],
			},
		},
	})

	useEffect(() => {
		const fetchRubricCourses = async () => {
			if (!rubricTemplateData) return
			const res = await getCoursesByRubricTemplate(rubricTemplateData!.rubricTemplateId!)

			form.reset({
				title: rubricTemplateData?.title,
				courses: res.data.map((course) => ({
					value: course.courseId!,
					label: course.name,
				})),
				rubric: {
					columns: rubricTemplateData?.columns.map((column, index) => ({
						rubricColumnId: index,
						...column,
					})),
					criteria: rubricTemplateData?.criteria.map((criteria, index) => ({
						criteriaId: index,
						...criteria,
					})),
				},
			})
		}
		fetchRubricCourses()
	}, [form, rubricTemplateData])

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await getCourses(0, 20, coursesFilter, "name", true)
			setCourses(res.data.map((course) => ({ value: course.courseId!, label: course.name })))
		}

		fetchCourses()

		form.reset()
	}, [form, open, coursesFilter])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {

			await updateRubricTemplate(rubricTemplateData!.rubricTemplateId!, {
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
				archived: rubricTemplateData!.archived,
			});

			onClose(false)
			toast.success("Rúbrica actualizada exitosamente")
		} catch (error) {
			console.error(error)
			toast.error("Error al actualizar la rúbrica")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-screen sm:max-w-[1200px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Editar Rúbrica</DialogTitle>
					<DialogDescription>
						Puedes editar los siguientes atributos de la rúbrica
					</DialogDescription>
				</DialogHeader>
				{rubricTemplateData && (
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
									Guardar
								</Button>
							</DialogFooter>
						</Form>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
