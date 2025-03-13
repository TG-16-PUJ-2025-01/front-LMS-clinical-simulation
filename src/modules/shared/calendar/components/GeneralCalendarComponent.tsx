import { useEffect, useState } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
	createViewWeek,
	createViewDay,
	createViewMonthGrid,
	createViewMonthAgenda,
	viewWeek,
} from "@schedule-x/calendar";
import { getEvents, Event } from "../service/calendarService";
import { toast } from "sonner";

export default function CalendarComponent() {
	const [events, setEvents] = useState<Event[]>([]);

    const loadEvents = async () => {
        try{
            const res = await getEvents();
            setEvents(res.data);

            console.log("Set events data", res.data)
        } catch (error){
            toast.error("Error trying to find events")
        }
    }

	useEffect(() => {
		loadEvents();
	}, []);

	const calendarApp = useNextCalendarApp({
		views: [createViewMonthGrid(), createViewMonthAgenda(), createViewWeek(), createViewDay()],
		theme: "shadcn",
		locale: "es-ES",
		defaultView: viewWeek.name,
		events: events,
		calendars: {
			personal: {
				label: "Personal",
				colorName: "green",
				lightColors: { main: "#1c7df9", container: "#d2e7ff", onContainer: "#002859" },
				darkColors: { main: "#c0dfff", onContainer: "#dee6ff", container: "#426aa2" },
			},
		},
	});

	return <ScheduleXCalendar calendarApp={calendarApp} />;
}
