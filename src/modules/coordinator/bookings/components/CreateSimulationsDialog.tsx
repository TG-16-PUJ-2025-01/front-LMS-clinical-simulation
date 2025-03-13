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

import CreateSimulationsForm from "./CreateSimulationsForm";

// 📌 Definir el tipo para una reserva
interface Reservation {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
}

// 📌 Definir el tipo de las props del componente
interface BookingDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

// 📌 Definir el tipo para las salas
interface Room {
  id: string;
  name: string;
}

const rooms: Room[] = [
  { id: "1", name: "Sala A" },
  { id: "2", name: "Sala B" },
];

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {
  // 📌 Tipar correctamente el estado de las reservas
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);

  // 📌 Filtrar reservas según la sala seleccionada
  const filteredReservations = reservations.filter(res => res.room === selectedRoom.name);

  // 📌 Configuración del calendario
  const calendarApp = useNextCalendarApp({
    views: [createViewWeek()],
    theme: "shadcn blue", 
    events: filteredReservations.map((res, index) => ({
      id: index.toString(),
      start: `${res.date}T${res.startTime}:00`,
      end: `${res.date}T${res.endTime}:00`,
      calendarId: "room",
    })),
    locale: 'es-ES'
  });

  // 📌 Tipar correctamente la función que agrega una reserva
  const addReservation = (newReservation: Reservation) => {
    setReservations(prev => [...prev, newReservation]);
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
        <CreateSimulationsForm rooms={rooms} reservations={reservations} onAddReservation={addReservation} />
      </DialogContent>
    </Dialog>
  );
}
