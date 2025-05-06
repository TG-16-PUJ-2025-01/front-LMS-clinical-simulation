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
}

export default function EditSimulationsDialog({
	open,
	onClose,
	simulation,
}: EditSimulationsDialogProps) {
	// Inicializar con la fecha de la simulación o la fecha actual
	const initialDate = simulation?.startDateTime ? new Date(simulation.startDateTime) : new Date()

	const [selectedDate, setSelectedDate] = useState<Date>(initialDate)

	// Plugins memoizados
	const eventsServicePlugin = useMemo(() => createEventsServicePlugin(), [])
	const calendarControls = useMemo(() => createCalendarControlsPlugin(), [])

	// Configuración del calendario
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
			selectedDate: selectedDate.toISOString().split("T")[0],
			callbacks: {
				onSelectedDateUpdate(date) {
					setSelectedDate(new Date(date))
				},
			},
		},
		[eventsServicePlugin, calendarControls]
	)

	// Sincronizar la fecha cuando cambia la simulación
	useEffect(() => {
		if (simulation?.startDateTime) {
			setSelectedDate(new Date(simulation.startDateTime))
		}
	}, [simulation])

	// Actualizar los controles del calendario
	useEffect(() => {
		if (calendarApp && calendarControls && selectedDate) {
			calendarControls.setDate(selectedDate.toISOString().split("T")[0])
		}
	}, [selectedDate, calendarApp, calendarControls])

	// Carga de reservas
	useEffect(() => {
		const fetchReservations = async () => {
			try {
				const reservationsData = await getSchedule(selectedDate.toISOString().split("T")[0])
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
						// selectedDate={selectedDate}
						// setSelectedDate={setSelectedDate}
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}
