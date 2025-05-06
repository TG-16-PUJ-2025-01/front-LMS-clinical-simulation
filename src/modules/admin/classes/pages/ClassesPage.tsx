import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { ClassesDataTable } from "../components/ClassesDataTable"

export default function ClassesPage() {
	return (
		<>
			<LayoutSlot name="title">Clases</LayoutSlot>
			<ClassesDataTable />
		</>
	)
}
