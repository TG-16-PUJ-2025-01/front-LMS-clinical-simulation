import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { useEffect, useState } from "react"
import { Input } from "@/modules/core/components/ui/input"
import { Check, Search } from "lucide-react"
import {
	getRecommendedRubricTemplatesByCourse,
	setRubricTemplateToPractice,
} from "../../rubricTemplates/services/rubricTemplateService"
import { Button } from "@/modules/core/components/ui/button"
import { toast } from "sonner"
import { useParams } from "react-router-dom"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
	courseId: number
	selectedRubricTemplate?: RubricTemplate
}

export default function AssignRubricDialog({
	open,
	onClose,
	courseId,
	selectedRubricTemplate,
}: Props) {
	const { practiceId } = useParams()
	const [rubricTemplates, setRubricTemplates] = useState<RubricTemplate[]>([])
	const [filter, setFilter] = useState("")
	const [newRubricTemplate, setNewRubricTemplate] = useState<RubricTemplate | null>(null)

	useEffect(() => {
		const fetchRubrics = async () => {
			const res = await getRecommendedRubricTemplatesByCourse(courseId, 0, 20, filter)
			if (selectedRubricTemplate) {
				setRubricTemplates(
					res.data.filter(
						(rubric) => rubric.rubricTemplateId !== selectedRubricTemplate.rubricTemplateId
					)
				)
			} else {
				setRubricTemplates(res.data)
			}
		}
		fetchRubrics()
	}, [filter])

	const handleSave = async () => {
		if (!newRubricTemplate) return

		await setRubricTemplateToPractice(Number(practiceId), newRubricTemplate.rubricTemplateId!)
		toast.info("Rúbrica asignada correctamente")
		onClose(false)
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Asignar Rúbrica</DialogTitle>
					<DialogDescription>
						Selecciona la rúbrica correspondiente a la práctica
						<br />
						Una vez calificada la práctica, la rúbrica no podrá ser cambiada
					</DialogDescription>
				</DialogHeader>
				<div className="relative w-full">
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar rúbrica"
						value={filter}
						onChange={(event) => {
							setFilter(event.target.value)
						}}
						className="w-full pl-8"
					/>
				</div>
				<div className="mt-4 flex max-h-80 flex-col gap-2 overflow-y-auto">
					{rubricTemplates.length === 0 && !selectedRubricTemplate && (
						<div className="p-4 text-center text-gray-500">
							No se encontraron rúbricas para esta asignatura
						</div>
					)}
					{selectedRubricTemplate && (
						<div
							key={selectedRubricTemplate.rubricTemplateId}
							className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-100"
						>
							<div className="flex items-center gap-4">
								<span>{selectedRubricTemplate.title}</span>
								<span>{new Date(selectedRubricTemplate.creationDate).toLocaleDateString()}</span>
							</div>
							{!newRubricTemplate && <Check className="h-4 w-4" />}
						</div>
					)}
					{rubricTemplates.map((rubric) => (
						<button
							key={rubric.rubricTemplateId}
							className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-100"
							onClick={() => {
								setNewRubricTemplate(rubric)
							}}
							disabled={rubric.rubricTemplateId === selectedRubricTemplate?.rubricTemplateId}
						>
							<div className="flex items-center gap-4">
								<span>{rubric.title}</span>
								<span>{rubric.creationDate.toLocaleDateString()}</span>
							</div>
							{rubric.rubricTemplateId === newRubricTemplate?.rubricTemplateId && (
								<Check className="h-4 w-4" />
							)}
						</button>
					))}
				</div>
				<Button className="mt-4 ml-auto w-fit" onClick={handleSave} disabled={!newRubricTemplate}>
					Guardar
				</Button>
			</DialogContent>
		</Dialog>
	)
}
