import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { StudentsClassDataTable } from "../components/MembersClassDataTable"

export default function MembersPage() {
	return (
		<>
			<LayoutSlot name="title">Miembros de la Clase</LayoutSlot>
			<StudentsClassDataTable />
		</>
	)
}
