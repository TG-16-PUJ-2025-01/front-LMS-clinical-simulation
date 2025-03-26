import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/modules/core/components/ui/dialog";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createViewDay, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import '@schedule-x/theme-shadcn/dist/index.css';

import CreateSimulationsForm from "./CreateSimulationsForm";
import { getAllRooms, getReservationsByRoom } from "../services/bookingService";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void; 
}

interface Room {
  id: string;
  name: string;
}

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<{ key: number; value: string }[]>([]);

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
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        setRooms(roomsData.map(room => ({ key: room.id, value: room.name })));
        if (roomsData.length > 0) {
          setSelectedRoom({ id: roomsData[0].id.toString(), name: roomsData[0].name });
        }
      } catch (error) {
        console.error("Error cargando salas:", error);
      }
    };

    if (open) {
      fetchRooms();
    }
  }, [open]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedRoom) return;

      try {
        const reservationsData = await getReservationsByRoom(selectedRoom.id);
        if (eventsServicePlugin?.set) {
          eventsServicePlugin.set(
            reservationsData.map((res, index) => ({
              id: index.toString(),
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
  }, [selectedRoom, eventsServicePlugin, calendarApp]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[90vw] h-[80vh] flex flex-row gap-4">
        <div className="w-2/3 border rounded-lg p-6 relative">
          <DialogHeader>
            <DialogTitle>Reserva de prácticas</DialogTitle>
          </DialogHeader>

          {/* Selector de sala */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Calendario para la sala:</span>
            <Combobox
              options={rooms}
              placeholderText="Seleccionar sala"
              itemName="Sala"
              onChange={(selected) => {
                const selectedRoomData = rooms.find(room => room.key === selected.key);
                if (selectedRoomData) {
                  setSelectedRoom({ id: selectedRoomData.key.toString(), name: selectedRoomData.value });
                }
              }}
              selectedValue={selectedRoom?.name || ""}
            />
          </div>

          <div className="mt-6 h-[55vh] overflow-y-auto">
            {calendarApp && <ScheduleXCalendar calendarApp={calendarApp} />}
          </div>
        </div>

        <CreateSimulationsForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
