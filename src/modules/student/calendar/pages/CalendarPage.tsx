import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import CalendarComponent from "@/modules/shared/calendar/components/GeneralCalendarComponent"

export default function CalendarPage() {
	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Asignaturas",
							href: `/estudiante/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/estudiante/calendario",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Calendario</LayoutSlot>
			<div className="h-[75vh] min-h-[500px] overflow-y-auto">
				<CalendarComponent />
			</div>
		</>
	)
}
