import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/core/components/ui/dialog"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { useEffect, useState } from "react"
import { getRubricTemplates } from "../../rubricTemplates/services/rubricTemplateService"
import { Input } from "@/modules/core/components/ui/input"
import { Search } from "lucide-react"

interface Props {
	open: boolean
	onClose: (open: boolean) => void
}

export default function AssignRubricDialog({ open, onClose }: Props) {
	const [rubricTemplates, setRubricTemplates] = useState<RubricTemplate[]>([])
	const [filter, setFilter] = useState("")

	useEffect(() => {
		const fetchRubrics = async () => {
			const res = await getRubricTemplates(0, 20, filter, "creationDate", true)
			setRubricTemplates(res.data)
		}
		fetchRubrics()
	}, [filter])

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent onSubmit={() => {}}>
				<DialogHeader>
					<DialogTitle>Seleccionar Rúbrica</DialogTitle>
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
					{rubricTemplates.length === 0 && (
						<div className="p-4 text-center text-gray-500">
							No se encontraron rúbricas para esta asignatura
						</div>
					)}
					{rubricTemplates.map((rubric) => (
						<div
							key={rubric.rubricTemplateId}
							className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-100"
						>
							<span>{rubric.title}</span>
							<span>{rubric.creationDate.toLocaleDateString()}</span>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
