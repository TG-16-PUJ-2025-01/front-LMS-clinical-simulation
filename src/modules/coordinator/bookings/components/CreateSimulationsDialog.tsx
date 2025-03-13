'use client';
import { useState, useEffect } from "react";
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
import axios from "axios";

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

export default function CreateSimulationsDialog({ open, onClose }: BookingDialogProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Obtener las salas al montar el componente
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/room/all");
        const roomsData = response.data.data.map((room: any) => ({
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

  // Obtener las reservas de la sala seleccionada
  useEffect(() => {
    const fetchReservations = async () => {
      if (!selectedRoom) return;

      try {
        const response = await axios.get(`http://localhost:8080/simulation/room?roomId=${selectedRoom.id}&startOfWeekDate=2025-03-11`);
        const reservationsData = response.data.data.map((res: any) => ({
          room: selectedRoom.name,
          date: res.startDateTime.split('T')[0], // Extraer la fecha (YYYY-MM-DD)
          startTime: res.startDateTime.split('T')[1].substring(0, 5), // Extraer la hora (HH:mm)
          endTime: res.endDateTime.split('T')[1].substring(0, 5), // Extraer la hora (HH:mm)
        }));
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [selectedRoom]);

  // 📌 Filtrar reservas según la sala seleccionada
  const filteredReservations = reservations.filter(res => res.room === selectedRoom?.name);

  // 📌 Configuración del calendario
  const calendarApp = useNextCalendarApp({
    views: [createViewWeek()],
    theme: "shadcn blue", 
    events: filteredReservations.map((res, index) => ({
      id: index.toString(), // ID único para cada evento
      title: `Reserva: ${res.room}`, // Título del evento
      start: `${res.date}T${res.startTime}:00`, // Fecha y hora de inicio (ISO 8601)
      end: `${res.date}T${res.endTime}:00`, // Fecha y hora de fin (ISO 8601)
      calendarId: "room", // ID del calendario
    })),
    locale: 'es-ES' // Configuración regional en español
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