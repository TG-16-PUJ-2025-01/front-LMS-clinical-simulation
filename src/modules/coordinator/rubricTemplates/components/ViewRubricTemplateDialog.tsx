import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import Rubric from "@/modules/core/models/rubric"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
	rubric?: Rubric
}

export default function ViewRubricTemplateDialog({
	open,
	onClose,
	rubric,
	rubricTemplateData,
}: Props) {
	const [selectColumnByCriteria, setSelectedColumnByCriteria] = useState<(number | undefined)[]>([])

	useEffect(() => {
		if (!rubric || !rubricTemplateData) return
		const res = rubric?.evaluatedCriterias.map((criteria) => {
			let col: number | undefined
			rubricTemplateData.columns.forEach((column, index) => {
				if (
					valueSelected(
						column.scoringScale.lowerValue,
						criteria.score,
						column.scoringScale.upperValue
					)
				) {
					col = index
				}
			})
			return col
		})
		setSelectedColumnByCriteria(res)
	}, [rubric, open])

	const valueSelected = (min: number, value: number, max: number): boolean => {
		return min <= value && value <= max
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-screen sm:max-w-[1200px]" aria-description="rubric" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Rúbrica: {rubricTemplateData?.title}</DialogTitle>
				</DialogHeader>
				{rubricTemplateData && (
					<article className="bg-background overflow-hidden rounded-md border [&>div]:-m-px [&>div]:w-[calc(100%+2px)]">
						<Table className="h-full">
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px] border py-1 align-top">Criterios</TableHead>
									{rubricTemplateData.columns.map((column, index) => (
										<TableHead key={index} className="border py-1">
											{column.title}
											<p className="text-blue-javeriana text-xs font-bold italic">{`${column.scoringScale.lowerValue} - ${column.scoringScale.upperValue} puntos`}</p>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{rubricTemplateData.criteria.map((criteria, index) => (
									<TableRow key={index}>
										<TableCell className="border font-medium">
											{criteria.name}
											<p className="text-blue-javeriana text-xs font-bold italic">{`${criteria.weight}%`}</p>
										</TableCell>
										{criteria.scoringScaleDescription.map((description, index2) => (
											<TableCell key={index2} className="border p-0.5">
												{selectColumnByCriteria[index] === index2 ? (
													<div className="outline-blue-javeriana bg-blue-javeriana/10 relative z-10 h-full w-full p-1.5 outline-2">
														{description}
														<Check className="text-blue-javeriana absolute top-1 right-1 size-4" />
													</div>
												) : (
													<div className="h-full w-full p-1.5">{description}</div>
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</article>
				)}
			</DialogContent>
		</Dialog>
	)
}
