import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { UsersDataTable } from "../components/UsersDataTable"

export default function UsersPage() {
	return (
		<>
			<LayoutSlot name="title">Usuarios</LayoutSlot>
			<UsersDataTable />
		</>
	)
}
