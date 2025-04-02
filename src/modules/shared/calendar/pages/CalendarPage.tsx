import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot";
import CalendarComponent from "../components/GeneralCalendarComponent";

export default function CalendarPage() {
	return (
		<>
			<LayoutSlot name="title">Calendario</LayoutSlot>
			<div className="mt-6 h-[75vh] overflow-y-auto min-h-[500px]">
				<CalendarComponent />
			</div>
		</>
	);
}
