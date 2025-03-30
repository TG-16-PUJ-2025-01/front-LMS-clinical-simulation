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
import { Eye } from "lucide-react"
import { Textarea } from "@/modules/core/components/ui/textarea"
import { Input } from "@/modules/core/components/ui/input"
import ViewRubricTemplateDialog from "../../rubricTemplates/components/ViewRubricTemplateDialog"
import { useState } from "react"

interface Props {
	rubricTemplate: RubricTemplate
}

const FormSchema = z.object({
	criteria: z.array(
		z.object({
			score: z.coerce.number(),
			description: z.string(),
		})
	),
	total: z.object({
		score: z.coerce.number(),
		description: z.string(),
	}),
})

export function RubricForm({ rubricTemplate }: Props) {
	const [openDialog, setOpenDialog] = useState(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			criteria: [
				{
					score: 0,
					description: "",
				},
				{
					score: 0,
					description: "",
				},
			],
			total: {
				score: 0,
				description: "",
			},
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		toast.success("Comentario publicado correctamente")
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="criteria"
						render={() => (
							<FormItem>
								<FormControl>
									<div className="flex flex-col gap-6">
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
														<TableRow>
															<TableCell className="border font-medium">
																{criteria.name}
																<p className="text-blue-javeriana text-xs font-bold italic">{`${criteria.weight}%`}</p>
															</TableCell>
															<TableCell className="border py-1 font-medium">
																<FormField
																	control={form.control}
																	name={`criteria.${index}.description`}
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
																<FormField
																	control={form.control}
																	name={`criteria.${index}.score`}
																	render={({ field }) => (
																		<FormItem className="inline-flex items-center">
																			<FormControl>
																				<Input
																					type="number"
																					min={0}
																					max={5}
																					className="m-0 h-full min-h-min w-full field-sizing-content resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
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
														<TableCell className="border font-medium">
															Total
															<p className="text-blue-javeriana text-xs font-bold italic">100%</p>
														</TableCell>
														<TableCell className="border py-1 font-medium">
															<FormField
																control={form.control}
																name="total.description"
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
															<FormField
																control={form.control}
																name="total.score"
																render={({ field }) => (
																	<FormItem className="inline-flex items-center">
																		<FormControl>
																			<Input
																				type="number"
																				min={0}
																				max={5}
																				className="m-0 h-full min-h-min w-full field-sizing-content resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																				{...field}
																			/>
																		</FormControl>
																		<p className="text-blue-javeriana font-bold italic">/5</p>
																	</FormItem>
																)}
															/>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</article>
										<div className="flex w-full items-center justify-end gap-4">
											<Button type="button" onClick={() => setOpenDialog(true)} variant="outline">
												<Eye />
												Ver rúbrica
											</Button>
											<Button type="submit" variant="default">
												Guardar
											</Button>
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
