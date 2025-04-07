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

interface Props {
	gradable?: boolean
	rubricTemplate?: RubricTemplate
}

const FormSchema = z.object({
	evaluatedCriterias: z.array(
		z.object({
			score: z.coerce.number(),
			comment: z.string(),
		})
	),
	total: z.object({
		score: z.coerce.number(),
		comment: z.string(),
	}),
})

export function RubricForm({ rubricTemplate, gradable = true }: Props) {
	const [openDialog, setOpenDialog] = useState(false)
	const [saving, setSaving] = useState(false)
	const [totalScore, setTotalScore] = useState(0)

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

	// Calculate the total score when the input changes
	const updatingTotal = useRef(false)

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
			setSaving(true)
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				if (!saving) return
				setSaving(false)
				// Save the rubric
			}, 5000)
		})

		return () => {
			if (timer) clearTimeout(timer)
			subscription.unsubscribe()
		}
	}, [form, saving])

	async function onSave() {
		const data = form.getValues()
		setSaving(false)
		toast.success("Rúbrica guardada correctamente")
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setSaving(false)
		toast.success("Rúbrica guardada correctamente")
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
										<p className="text-blue-javeriana text-right text-xs italic ml-auto">
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
										<div className="flex w-full items-center justify-end gap-4">
											<Button type="button" onClick={() => setOpenDialog(true)} variant="outline">
												<Eye />
												Ver rúbrica
											</Button>
											<Button type="button" onClick={onSave}>
												Guardar
											</Button>
											<Button type="submit">Publicar</Button>
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
			/>
		</>
	)
}
