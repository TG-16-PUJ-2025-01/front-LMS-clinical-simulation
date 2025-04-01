import { useEffect } from "react"
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import { createCurrentTimePlugin } from "@schedule-x/current-time"
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls"
import {
	createViewWeek,
	createViewDay,
	createViewMonthGrid,
	createViewMonthAgenda,
	viewWeek,
} from "@schedule-x/calendar"
import { getAllEvents, getEvents } from "../service/calendarService"
import { toast } from "sonner"

export default function CalendarComponent() {
	const eventsServicePlugin = createEventsServicePlugin()
	const eventModal = createEventModalPlugin()
	const calendarControls = createCalendarControlsPlugin()
	const currentTimePlugin = createCurrentTimePlugin()

	const loadEvents = async (start: string, end: string) => {
		try {
			if (location.pathname === "/admin/calendario") {
				const adminRes = await getAllEvents(start, end)
				eventsServicePlugin.set(adminRes.data)
			} else {
				const res = await getEvents()
				eventsServicePlugin.set(res.data)
			}
		} catch (error) {
			console.error("Error loading events:", error)
			toast.error("Error trying to find events")
		}
	}

	const calendarApp = useNextCalendarApp({
		views: [createViewMonthGrid(), createViewMonthAgenda(), createViewWeek(), createViewDay()],
		theme: "shadcn",
		locale: "es-ES",
		dayBoundaries: {
			start: "06:00",
			end: "20:00",
		},
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
			Supervisor: {
				label: "Supervisor",
				colorName: "custom-green",
				lightColors: {
					main: "#28a745",
					container: "#d4edda",
					onContainer: "#155724",
				},
				darkColors: {
					main: "#6c9d6e",
					container: "#1e3b1e",
					onContainer: "#d8f3d8",
				},
			},
		},
		plugins: [eventsServicePlugin, eventModal, currentTimePlugin, calendarControls],
		callbacks: {
			onRangeUpdate: () => {
				const range = calendarControls.getRange()
				if (range?.start && range?.end) {
					loadEvents(range.start, range.end)
				}
			},
		},
	})

	useEffect(() => {
		const range = calendarControls.getRange()
		if (range?.start && range?.end) {
			loadEvents(range.start, range.end)
		}
	}, [])

	return <ScheduleXCalendar calendarApp={calendarApp} />
}
