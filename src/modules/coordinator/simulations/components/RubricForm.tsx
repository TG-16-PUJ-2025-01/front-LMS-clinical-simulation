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

interface Props {
	rubricTemplate: RubricTemplate
}

// const FormSchema = z.object({
// 	criteria: z.array(
// 		z.object({
// 			score: z.coerce.number(),
// 			description: z.string(),
// 		})
// 	),
// })

export function RubricForm({ rubricTemplate }: Props) {
	return (
		<div className="flex flex-col gap-8">
			<article className="max-h-[60vh] flex-1 overflow-auto rounded-md border">
				{/* <Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="criteria"
						render={({ field }) => (
							<FormItem>
								<Table className="h-full w-full">
									<TableHeader>
										<TableRow>
											<TableHead className="border py-1 align-top">Criterios</TableHead>
											{rubricTemplate.columns.map((column) => (
												<TableHead key={column.title} className="border py-1 align-top">
													{column.title}
													<p className="text-blue-javeriana text-xs font-bold italic">{`${column.scoringScale.lowerValue} - ${column.scoringScale.upperValue} puntos`}</p>
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{rubricTemplate.criteria.map((criteria) => (
											<TableRow>
												<TableCell className="border font-medium">
													{criteria.name}
													<p className="text-blue-javeriana text-xs font-bold italic">{`${criteria.weight}%`}</p>
												</TableCell>
												{criteria.scoringScaleDescription.map((criteriaDescription) => (
													<TableCell className="border font-medium">{criteriaDescription}</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form> */}
				<Table className="h-full w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="w-48 border py-1 align-top">Criterios</TableHead>
							<TableHead className="border py-1 align-top">Comentarios</TableHead>
							<TableHead className="w-14 border py-1 align-top">Nota</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rubricTemplate.criteria.map((criteria) => (
							<TableRow>
								<TableCell className="border font-medium">
									{criteria.name}
									<p className="text-blue-javeriana text-xs font-bold italic">{`${criteria.weight}%`}</p>
								</TableCell>
								<TableCell className="border font-medium"></TableCell>
								<TableCell className="border text-right font-medium">
									<p className="text-blue-javeriana font-bold italic">/5</p>
								</TableCell>
							</TableRow>
						))}
						<TableRow>
							<TableCell className="border font-medium">
								Total
								<p className="text-blue-javeriana text-xs font-bold italic">100%</p>
							</TableCell>
							<TableCell className="border font-medium"></TableCell>
							<TableCell className="border text-right font-medium">
								<p className="text-blue-javeriana font-bold italic">/5</p>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</article>
			<Button className="ml-auto w-fit">Calificar</Button>
		</div>
	)
}
