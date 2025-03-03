import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { CoursesDataTable } from "../components/CoursesDataTable"

export default function CoursesPage() {
	return (
		<>
			<LayoutSlot name="title">Asignaturas</LayoutSlot>
			<CoursesDataTable />
		</>
	)
}
