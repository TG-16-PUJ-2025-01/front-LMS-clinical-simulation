import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { RoomsDataTable } from "../components/RoomsDataTable"

export default function RoomsPage() {
	return (
		<>
			<LayoutSlot name="title">Salas</LayoutSlot>
			<RoomsDataTable />
		</>
	)
}
