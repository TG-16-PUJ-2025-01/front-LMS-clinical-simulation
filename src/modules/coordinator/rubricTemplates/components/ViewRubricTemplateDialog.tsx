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
import RubricTemplate from "@/modules/core/models/rubricTemplate"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	rubricTemplateData?: RubricTemplate
}

export default function ViewRubricTemplateDialog({ open, onClose, rubricTemplateData }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-screen sm:max-w-[1200px]" onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Visualizar Rúbrica</DialogTitle>
				</DialogHeader>
				{rubricTemplateData && (
          <article className="bg-background rounded-md border overflow-hidden [&>div]:-m-px [&>div]:w-[calc(100%+2px)]">
						<Table className="h-full">
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px] border py-1 align-top">Criterios</TableHead>
									<TableHead className="w-20 min-w-20 border py-1 align-top">Peso</TableHead>
									{rubricTemplateData.columns.map((column, index) => (
										<TableHead key={index} className="text-accent-foreground border py-1">
											{column.title}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{rubricTemplateData.criteria.map((criteria, index) => (
									<TableRow key={index}>
										<TableCell className="border font-medium"></TableCell>
										<TableCell className="border font-medium"></TableCell>
										{criteria.scoringScaleDescription.map((description, index2) => (
											<TableCell key={index2} className="border">
												{description}
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
