import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/modules/core/components/ui/dialog";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createViewDay } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import '@schedule-x/theme-shadcn/dist/index.css';

import CreateSimulationsForm from "./CreateSimulationsForm";
import { getSchedule } from "../services/bookingService";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {

  const eventsServicePlugin = useMemo(() => createEventsServicePlugin(), []);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(new Date().toISOString().split('T')[0]);

  const calendarApp = useNextCalendarApp(
    {
      views: [createViewDay()],
      theme: "shadcn blue",
      locale: "es-ES",
      dayBoundaries: {
        start: '06:00',
        end: '20:00',
      },
      callbacks: {
        onSelectedDateUpdate(date) {
          setSelectedDate(date);
        },
      }
    },
    [eventsServicePlugin]
  );



  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!selectedDate) return;
        const reservationsData = await getSchedule(selectedDate);
        if (eventsServicePlugin?.set) {
          eventsServicePlugin.set(
            reservationsData.map((res, index) => ({
              id: index.toString(),
              title: res.room,
              start: res.startDateTime,
              end: res.endDateTime,
              calendarId: "room",
            }))
          );
        }
      } catch (error) {
        console.error("Error cargando reservas:", error);
      }
    };
    if (open) {
      fetchReservations();
    }
  }, [open, eventsServicePlugin, calendarApp, selectedDate]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-row gap-4">
        <div className="flex-1 overflow-y-auto">
          {calendarApp && <ScheduleXCalendar calendarApp={calendarApp} />}
        </div>
        <CreateSimulationsForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
