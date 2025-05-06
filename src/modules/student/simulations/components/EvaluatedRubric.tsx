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
import { Eye } from "lucide-react"
import { useEffect, useState } from "react"
import Rubric from "@/modules/core/models/rubric"
import GradeStatus from "@/modules/core/models/gradeStatus"
import ViewRubricTemplateDialog from "@/modules/coordinator/rubricTemplates/components/ViewRubricTemplateDialog"

interface Props {
	gradable?: boolean
	rubricTemplate?: RubricTemplate
	rubric?: Rubric
	gradeStatus?: GradeStatus
}

export function EvaluatedRubric({ rubricTemplate, rubric, gradable = true, gradeStatus }: Props) {
	const [openDialog, setOpenDialog] = useState(false)
  const [rubricData, setRubricData] = useState<Rubric | undefined>(undefined)
  
  useEffect(() => {
    if (gradeStatus !== GradeStatus.REGISTERED) {
      setRubricData(undefined)
    } else {
      setRubricData(rubric)
    }
  }, [gradeStatus])

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
										<p className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0">
											{rubricData?.evaluatedCriterias[index].comment}
										</p>
									</TableCell>
									<TableCell className="border text-right font-medium">
										<div className="inline-flex items-center gap-4 text-neutral-600">
											{rubricData?.evaluatedCriterias[index].score}
											<p className="text-blue-javeriana font-bold italic">/5</p>
										</div>
									</TableCell>
								</TableRow>
							))}
							<TableRow>
								<TableCell className="border font-medium text-neutral-600">
									Total
									<p className="text-blue-javeriana text-xs font-bold italic">100%</p>
								</TableCell>
								<TableCell className="border py-1 font-medium">
									<p className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0">
										{rubricData?.total.comment}
									</p>
								</TableCell>
								<TableCell className="border text-right font-medium">
									<div className="inline-flex items-center gap-4 text-neutral-600">
										{rubricData?.total.score} 
										<p className="text-blue-javeriana font-bold italic">/5</p>
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</article>
				{gradeStatus !== GradeStatus.REGISTERED && (
					<p className="text-blue-javeriana ml-auto text-right text-xs italic">
						La práctica no ha sido calificada
					</p>
				)}
				<div className="flex w-full items-center justify-end">
					<Button type="button" onClick={() => setOpenDialog(true)} variant="outline">
						<Eye />
						Ver rúbrica
					</Button>
				</div>
			</div>
			<ViewRubricTemplateDialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				rubricTemplateData={rubricTemplate}
				rubric={rubricData}
			/>
		</>
	)
}
