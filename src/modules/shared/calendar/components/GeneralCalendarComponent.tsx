import { useEffect } from "react"
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import {
	createViewWeek,
	createViewDay,
	createViewMonthGrid,
	createViewMonthAgenda,
	viewWeek,
} from "@schedule-x/calendar"
import { getEvents } from "../service/calendarService"
import { toast } from "sonner"

export default function CalendarComponent() {
	const eventsServicePlugin = createEventsServicePlugin()
	const eventModal = createEventModalPlugin()

	const calendarApp = useNextCalendarApp({
		views: [createViewMonthGrid(), createViewMonthAgenda(), createViewWeek(), createViewDay()],
		theme: "shadcn",
		locale: "es-ES",
		defaultView: viewWeek.name,
		calendars: {
			Reserva: {
				label: "Reserva",
				colorName: "custom-blue",
				lightColors: {
					main: "#1c7df9",
					container: "#d2e7ff",
					onContainer: "#002859",
				},
				darkColors: {
					main: "#8AA8D6",
					container: "#1C3A60",
					onContainer: "#DDE6F2",
				},
			},
		},
		plugins: [eventsServicePlugin, eventModal],
	})

	const loadEvents = async () => {
		try {
			const res = await getEvents()
			eventsServicePlugin.set(res.data)
		} catch (error) {
			toast.error("Error trying to find events")
		}
	}

	useEffect(() => {
		loadEvents()
	}, [])

	return <ScheduleXCalendar calendarApp={calendarApp} />
}
