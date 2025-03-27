import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/modules/core/components/ui/dialog";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createViewDay } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import '@schedule-x/theme-shadcn/dist/index.css';

import CreateSimulationsForm from "./CreateSimulationsForm";
import { getAllRooms, getSchedule } from "../services/bookingService";
import { ro } from "date-fns/locale";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void; 
}

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {

  const eventsServicePlugin = useMemo(() => createEventsServicePlugin(), []);

  const calendarApp = useNextCalendarApp(
    { 
      views: [createViewDay()], 
      theme: "shadcn blue", 
      locale: "es-ES",
      dayBoundaries: {
        start: '06:00',
        end: '20:00',
      },
    },
    [eventsServicePlugin]
  );



  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsData = await getSchedule();
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

    fetchReservations();
  }, [eventsServicePlugin, calendarApp]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[90vw] h-[80vh] flex flex-row gap-4">
        <div className="w-2/3 border rounded-lg p-6 relative">
          <DialogHeader>
            <DialogTitle>Reserva de prácticas</DialogTitle>
          </DialogHeader>
          <div className="mt-6 h-[55vh] overflow-y-auto">
            {calendarApp && <ScheduleXCalendar calendarApp={calendarApp} />}
          </div>
        </div>

        <CreateSimulationsForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
