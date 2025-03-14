import { useEffect } from "react"
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import {
	createViewWeek,
	createViewDay,
	createViewMonthGrid,
	createViewMonthAgenda,
	viewWeek,
} from "@schedule-x/calendar"
import { getEvents, Event } from "../service/calendarService"
import { toast } from "sonner"

export default function CalendarComponent() {
	const eventsServicePlugin = createEventsServicePlugin()

	const calendarApp = useNextCalendarApp(
		{
			views: [createViewMonthGrid(), createViewMonthAgenda(), createViewWeek(), createViewDay()],
			theme: "shadcn",
			locale: "es-ES",
			defaultView: viewWeek.name,
			calendars: {
				personal: {
					label: "Personal",
					colorName: "green",
					lightColors: {
						main: "#1c7df9",
						container: "#d2e7ff",
						onContainer: "#002859",
					},
					darkColors: {
						main: "#c0dfff",
						onContainer: "#dee6ff",
						container: "#426aa2",
					},
				},
			},
		},
		[eventsServicePlugin]
	)

	const loadEvents = async () => {
		try {
			const res = await getEvents()
			const fetchedEvents: Event[] = res.data

			if (Array.isArray(fetchedEvents)) {
				const existingEvents = eventsServicePlugin.getAll().map((e) => e.id)

				fetchedEvents.forEach((event) => {
					if (!existingEvents.includes(event.id)) {
						eventsServicePlugin.add({
							id: event.id,
							title: event.title,
							start: event.start,
							end: event.end,
						})
					}
				})
			}
		} catch (error) {
			toast.error("Error trying to find events")
		}
	}

	useEffect(() => {
		loadEvents()
	}, [])

	return <ScheduleXCalendar calendarApp={calendarApp} />
}
