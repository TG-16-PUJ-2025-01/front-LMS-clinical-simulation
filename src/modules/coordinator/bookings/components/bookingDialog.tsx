'use client';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";

import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import '@schedule-x/theme-shadcn/dist/index.css';
import { Popover, PopoverTrigger, PopoverContent } from "@/modules/core/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/modules/core/components/ui/command";
import { Button } from "@/modules/core/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";

import BookingForm from "./BookingForm";

const rooms = [
  { id: "1", name: "Sala A" },
  { id: "2", name: "Sala B" },
];

export default function BookingDialog({ open, onClose }) {
  const [reservations, setReservations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  // Filtrar reservas según la sala seleccionada
  const filteredReservations = reservations.filter(res => res.room === selectedRoom.name);

  const calendarApp = useNextCalendarApp({
    views: [createViewWeek()],
    theme: "shadcn",
    calendars: { room: { label: "Sala", colorName: "blue" } },
    events: filteredReservations.map((res, index) => ({
      id: index,
      title: `Reserva - ${res.userName}`,
      start: `${res.date}T${res.startTime}:00`,
      end: `${res.date}T${res.endTime}:00`,
      calendarId: "room",
    })),
    locale: 'es-ES'
  });

  const addReservation = (newReservation) => {
    setReservations([...reservations, newReservation]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[80vh] flex flex-row gap-4">
        {/* Calendario */}
        <div className="w-2/3 border rounded-lg p-6 relative">
          <DialogHeader>
            <DialogTitle>Reserva de prácticas</DialogTitle>
          </DialogHeader>

          {/* Select de Sala con margen extra */}
          <div className="mt-6 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Calendario para la sala:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between">
                  {selectedRoom.name}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar sala..." />
                  <CommandList>
                    {rooms.map(room => (
                      <CommandItem key={room.id} value={room.name} onSelect={() => setSelectedRoom(room)}>
                        <Check className={`mr-2 h-4 w-4 ${selectedRoom.id === room.id ? "opacity-100" : "opacity-0"}`} />
                        {room.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Espaciado extra entre el select y el calendario */}
          <div className="mt-6 h-[55vh] overflow-y-auto">
            <ScheduleXCalendar calendarApp={calendarApp} />
          </div>
        </div>

        {/* Formulario */}
        <BookingForm rooms={rooms} reservations={reservations} onAddReservation={addReservation} />
      </DialogContent>
    </Dialog>
  );
}
