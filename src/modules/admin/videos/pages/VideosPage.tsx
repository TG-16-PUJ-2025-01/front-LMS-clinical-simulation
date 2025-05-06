import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { VideosDataTable } from "../components/VideosDataTable"

export default function VideosPage() {
	return (
		<>
			<LayoutSlot name="title">Videos</LayoutSlot>
			<VideosDataTable />
		</>
	)
}
