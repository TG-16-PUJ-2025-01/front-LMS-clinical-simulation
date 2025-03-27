import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { RubricTemplateDataTable } from "../components/RubricTemplateDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function RubricTemplatePage() {
	return (
		<>
			<LayoutSlot name="header">
				<NavBar />
			</LayoutSlot>
			<LayoutSlot name="title">Rúbricas</LayoutSlot>
			<RubricTemplateDataTable />
		</>
	)
}
