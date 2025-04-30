import RubricTemplate from "@/modules/core/models/rubricTemplate"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import { Button } from "@/modules/core/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/modules/core/components/ui/form"
import { Check, Eye, RefreshCcw } from "lucide-react"
import { Textarea } from "@/modules/core/components/ui/textarea"
import { Input } from "@/modules/core/components/ui/input"
import ViewRubricTemplateDialog from "../../rubricTemplates/components/ViewRubricTemplateDialog"
import { useEffect, useRef, useState } from "react"
import Rubric from "@/modules/core/models/rubric"
import RubricDto from "../dtos/rubricDto"
import { publishSimulationGrade, updateSimulationRubric } from "../services/simulationService"
import { useParams } from "react-router-dom"
import GradeStatus from "@/modules/core/models/gradeStatus"

interface Props {
	gradable?: boolean
	rubricTemplate?: RubricTemplate
	rubric?: Rubric
	gradeStatus?: GradeStatus
}

const FormSchema = z
	.object({
		evaluatedCriterias: z.array(
			z.object({
				score: z.coerce.number().default(0),
				comment: z.string().default(""),
			})
		),
		total: z.object({
			score: z.coerce.number().default(0),
			comment: z.string().default(""),
		}),
	})
	.superRefine((rubric, ctx) => {
		const hasEmptyComments = rubric.evaluatedCriterias.some((criteria) => criteria.comment === "")
		if (hasEmptyComments || rubric.total.comment === "") {
			console.log("add issue")
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Todos los criterios deben tener comentario",
				path: ["evaluatedCriterias"],
			})
		}
	})

export function RubricForm({
	rubricTemplate,
	rubric,
	gradeStatus: initialGradeStatus,
	gradable = true,
}: Props) {
	const { id } = useParams()
	const [openDialog, setOpenDialog] = useState(false)
	const [saving, setSaving] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [editing, setEditing] = useState(true)
	const [gradeStatus, setGradeStatus] = useState(initialGradeStatus ?? GradeStatus.PENDING)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			evaluatedCriterias: [],
			total: {
				score: 0,
				comment: "",
			},
		},
	})
	useEffect(() => {
		if (initialGradeStatus) {
			setGradeStatus(initialGradeStatus)
			setEditing(initialGradeStatus === GradeStatus.PENDING)
		}
	}, [initialGradeStatus])

	// Calculate the total score when the input changes
	const updatingTotal = useRef(false)

	useEffect(() => {
		if (!rubric) return
		setTotalScore(rubric.total.score ?? 0)
		form.reset({
			evaluatedCriterias: rubric.evaluatedCriterias.map((criteria) => ({
				score: criteria.score ?? 0,
				comment: criteria.comment ?? "",
			})),
			total: {
				score: rubric.total.score ?? 0,
				comment: rubric.total.comment ?? "",
			},
		})
	}, [rubric, form])

	useEffect(() => {
		if (!rubricTemplate) return

		const subscription = form.watch((value) => {
			if (updatingTotal.current) {
				updatingTotal.current = false
				return
			}

			const criteria = value.evaluatedCriterias || []
			const total = criteria.reduce((acc, curr, index) => {
				return acc + (curr?.score ?? 0) * (rubricTemplate?.criteria[index]?.weight ?? 0)
			}, 0)
			const totalScore = Math.round(total) / 100
			setTotalScore(totalScore)

			updatingTotal.current = true
			form.setValue("total.score", totalScore, { shouldDirty: false })
		})
		return () => subscription.unsubscribe()
	}, [form, rubricTemplate])

	// auto save rubric after 5 seconds
	useEffect(() => {
		let timer: NodeJS.Timeout | null = null

		const subscription = form.watch((value) => {
			if (gradeStatus !== GradeStatus.PENDING) return
			setSaving(true)
			if (timer) clearTimeout(timer)
			timer = setTimeout(async () => {
				if (!saving) return
				await saveRubric({
					evaluatedCriterias: value.evaluatedCriterias,
					total: value.total,
				})
				setSaving(false)
			}, 5000)
		})

		return () => {
			if (timer) clearTimeout(timer)
			subscription.unsubscribe()
		}
	}, [form, saving])

	async function saveRubric(rubric: RubricDto) {
		await updateSimulationRubric(Number(id), rubric)
	}

	async function onSave() {
		const data = form.getValues()
		await saveRubric({
			evaluatedCriterias: data.evaluatedCriterias,
			total: data.total,
		})
		setSaving(false)
		toast.success("Rúbrica guardada exitosamente")
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		await Promise.all([
			saveRubric({
				evaluatedCriterias: data.evaluatedCriterias,
				total: data.total,
			}),
			publishSimulationGrade(Number(id)),
		])
		setSaving(false)
		setEditing(false)
		setGradeStatus(GradeStatus.REGISTERED)

		toast.success("Rúbrica publicada exitosamente")
	}

	if (!gradable) {
		return (
			<div className="flex h-full items-center justify-center">La práctica no es calificable</div>
		)
	}

	if (!rubricTemplate) {
		return (
			<div className="flex h-full items-center justify-center">
				La práctica no tiene rúbrica asignada
			</div>
		)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="evaluatedCriterias"
						render={() => (
							<FormItem>
								<FormControl>
									<div className="flex flex-col gap-3">
										<article className="flex-1 overflow-hidden rounded-md border [&>div]:-m-px [&>div]:max-h-[60vh] [&>div]:w-[calc(100%+2px)]">
											<Table className="h-full w-full">
												<TableHeader>
													<TableRow>
														<TableHead className="w-28 border py-1 align-top md:w-32 lg:w-40">
															Criterios
														</TableHead>
														<TableHead className="border py-1 align-top">Comentarios</TableHead>
														<TableHead className="w-16 border py-1 align-top">Nota</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{rubricTemplate.criteria.map((criteria, index) => (
														<TableRow key={index}>
															<TableCell className="border font-medium text-neutral-600">
																{criteria.name}
																<p className="text-blue-javeriana text-xs font-bold italic">{`${criteria.weight}%`}</p>
															</TableCell>
															<TableCell className="border py-1 font-medium">
																<FormField
																	control={form.control}
																	name={`evaluatedCriterias.${index}.comment`}
																	render={({ field }) => (
																		<FormItem className="h-full">
																			<FormControl>
																				<Textarea
																					defaultValue={""}
																					className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																					disabled={!editing}
																					{...field}
																				/>
																			</FormControl>
																		</FormItem>
																	)}
																/>
															</TableCell>
															<TableCell className="border text-right font-medium">
																<FormField
																	control={form.control}
																	name={`evaluatedCriterias.${index}.score`}
																	render={({ field }) => (
																		<FormItem className="inline-flex items-center">
																			<FormControl>
																				<Input
																					type="number"
																					defaultValue={0}
																					min={0}
																					max={5}
																					className="m-0 field-sizing-content h-full min-h-min w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																					disabled={!editing}
																					{...field}
																				/>
																			</FormControl>
																			<p className="text-blue-javeriana font-bold italic">/5</p>
																		</FormItem>
																	)}
																/>
															</TableCell>
														</TableRow>
													))}
													<TableRow>
														<TableCell className="border font-medium text-neutral-600">
															Total
															<p className="text-blue-javeriana text-xs font-bold italic">100%</p>
														</TableCell>
														<TableCell className="border py-1 font-medium">
															<FormField
																control={form.control}
																name="total.comment"
																render={({ field }) => (
																	<FormItem className="h-full">
																		<FormControl>
																			<Textarea
																				className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																				disabled={!editing}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</TableCell>
														<TableCell className="border text-right font-medium">
															<div className="inline-flex items-center gap-4 text-neutral-600">
																{totalScore}
																<p className="text-blue-javeriana font-bold italic">/5</p>
															</div>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</article>
										{gradeStatus === GradeStatus.PENDING && (
											<p className="text-blue-javeriana ml-auto text-right text-xs italic">
												{saving ? (
													<span className="flex items-center gap-1">
														<RefreshCcw className="size-4" />
														Sincronizando cambios...
													</span>
												) : (
													<span className="flex items-center gap-1">
														<Check className="size-4" />
														Cambios sincronizados
													</span>
												)}
											</p>
										)}
										<div className="flex w-full items-center justify-end gap-4">
											<Button type="button" onClick={() => setOpenDialog(true)} variant="outline">
												<Eye />
												Ver rúbrica
											</Button>
											{gradeStatus === GradeStatus.PENDING && (
												<Button type="button" onClick={onSave}>
													Guardar
												</Button>
											)}
											{gradeStatus === GradeStatus.PENDING ? (
												<Button type="submit">Publicar</Button>
											) : editing ? (
												<Button type="submit">Guardar</Button>
											) : (
												<Button
													type="button"
													onClick={() => setTimeout(() => setEditing(true))}
												>
													Actualizar
												</Button>
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
			<ViewRubricTemplateDialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				rubricTemplateData={rubricTemplate}
				rubric={form.getValues()}
			/>
		</>
	)
}
