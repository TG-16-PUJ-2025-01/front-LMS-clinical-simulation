'use client';
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";

import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import '@schedule-x/theme-shadcn/dist/index.css';
import { Popover, PopoverTrigger, PopoverContent } from "@/modules/core/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/modules/core/components/ui/command";
import { Button } from "@/modules/core/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import axios from "axios";

import CreateSimulationsForm from "./CreateSimulationsForm";

interface Reservation {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

interface Room {
  id: string;
  name: string;
}

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [startOfWeekDate, setStartOfWeekDate] = useState<string>("2025-03-11");

  // Inicializar el plugin con useMemo
  const eventsServicePlugin = useMemo(() => createEventsServicePlugin(), []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/room/all");
        const roomsData = response.data.data.map((room: { id: number; name: string }) => ({
          id: room.id.toString(),
          name: room.name,
        }));
        setRooms(roomsData);
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedRoom || !startOfWeekDate) {
        console.log("No se puede hacer la petición: sala o fecha no seleccionada");
        return;
      }

      console.log("Haciendo petición para:", selectedRoom.id, startOfWeekDate);

      try {
        const response = await axios.get(
          `http://localhost:8080/simulation/room?roomId=${selectedRoom.id}&startOfWeekDate=${startOfWeekDate}`
        );
        const reservationsData = response.data.data.map((res: { startDateTime: string; endDateTime: string }) => ({
          room: selectedRoom.name,
          date: res.startDateTime.split('T')[0],
          startTime: res.startDateTime,
          endTime: res.endDateTime
        }));
        setReservations(reservationsData);

        if (eventsServicePlugin && typeof eventsServicePlugin.set === "function") {
            console.log("Setting events in eventsServicePlugin:", reservationsData);
            eventsServicePlugin.set(
            reservationsData.map((res, index) => (
              {
              id: index.toString(),
              start: `${res.startTime}`,
              end: `${res.endTime}`,
              calendarId: "room",
            }))
            );
        }

        console.log("Reservas actualizadas:", reservationsData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [selectedRoom, startOfWeekDate, eventsServicePlugin]);

  const calendarApp = useNextCalendarApp(
    {
      views: [createViewWeek()],
      theme: "shadcn blue",
      locale: 'es-ES',
    },
    [eventsServicePlugin]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[80vh] flex flex-row gap-4">
        <div className="w-2/3 border rounded-lg p-6 relative">
          <DialogHeader>
            <DialogTitle>Reserva de prácticas</DialogTitle>
          </DialogHeader>

          <div className="mt-6 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Calendario para la sala:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between">
                  {selectedRoom ? selectedRoom.name : "Seleccionar sala"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar sala..." />
                  <CommandList>
                    {rooms.map(room => (
                      <CommandItem key={room.id} value={room.name} onSelect={() => setSelectedRoom(room)}>
                        <Check className={`mr-2 h-4 w-4 ${selectedRoom?.id === room.id ? "opacity-100" : "opacity-0"}`} />
                        {room.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-6 h-[55vh] overflow-y-auto">
            <ScheduleXCalendar calendarApp={calendarApp} />
          </div>
        </div>

        <CreateSimulationsForm />
      </DialogContent>
    </Dialog>
  );
}
