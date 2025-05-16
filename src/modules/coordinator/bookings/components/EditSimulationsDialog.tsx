import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/modules/core/components/ui/dialog"
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react"
import { createViewDay } from "@schedule-x/calendar"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import "@schedule-x/theme-shadcn/dist/index.css"
import { getSchedule } from "../services/bookingService"
import Simulation from "@/modules/core/models/simulation"
import EditSimulationsForm from "./EditSimulationsForm"
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls"
import { toast } from "sonner"

interface EditSimulationsDialogProps {
	open: boolean
	onClose: () => void
	simulation: Simulation | null
	onReservationsUpdated: () => void
}

export default function EditSimulationsDialog({
	open,
	onClose,
	simulation,
	onReservationsUpdated,
}: EditSimulationsDialogProps) {
	const initialDate = simulation?.startDateTime
		? new Date(simulation.startDateTime).toLocaleDateString("en-CA")
		: new Date().toLocaleDateString("en-CA")

	const [selectedDate, setSelectedDate] = useState<string>(initialDate)

	const eventsServicePlugin = useMemo(() => createEventsServicePlugin(), [])
	const calendarControls = useMemo(() => createCalendarControlsPlugin(), [])

	const calendarApp = useNextCalendarApp(
		{
			views: [createViewDay()],
			theme: "shadcn blue",
			locale: "es-ES",
			dayBoundaries: {
				start: "06:00",
				end: "20:00",
			},
			defaultView: "day",
			selectedDate: selectedDate,
			callbacks: {
				onSelectedDateUpdate(date) {
					setSelectedDate(date)
				},
			},
		},
		[eventsServicePlugin, calendarControls]
	)

	useEffect(() => {
		calendarControls.setDate(selectedDate)
	}, [selectedDate])

	useEffect(() => {
		if (simulation?.startDateTime) {
			setSelectedDate(new Date(simulation.startDateTime).toLocaleDateString("en-CA"))
		}
	}, [simulation])

	useEffect(() => {
		const fetchReservations = async () => {
			try {
				const reservationsData = await getSchedule(selectedDate)
				eventsServicePlugin?.set(
					reservationsData.map((res, index) => ({
						id: index.toString(),
						title: res.room,
						start: res.startDateTime,
						end: res.endDateTime,
						calendarId: "room",
					}))
				)
			} catch (error) {
				console.error("Error cargando reservas:", error)
				toast.error("Error al cargar las reservas existentes")
			}
		}

		if (open) {
			fetchReservations()
		}
	}, [open, eventsServicePlugin, selectedDate])

	if (!simulation) return null

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="flex h-[90vh] max-w-[90vw] flex-col gap-4">
				<DialogTitle>Editar simulación</DialogTitle>
				<div className="flex flex-1 flex-row gap-4 overflow-hidden">
					<div className="flex-1 overflow-y-auto">
						{calendarApp && <ScheduleXCalendar calendarApp={calendarApp} />}
					</div>
					<EditSimulationsForm
						onClose={onClose}
						simulation={simulation}
						setDate={(date) => calendarControls.setDate(date)}
						onReservationsUpdated={onReservationsUpdated}
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}
