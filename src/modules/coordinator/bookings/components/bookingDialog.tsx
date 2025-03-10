import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/core/components/ui/dialog";
import { Button } from "@/modules/core/components/ui/button";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/modules/core/components/ui/command";
import { Check, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, startOfWeek, format, eachDayOfInterval } from "date-fns";

// Datos de ejemplo para las salas y sus agendas
const rooms = [
  {
    id: "1",
    name: "Sala A",
    agenda: [
      { date: "2025-03-10", startTime: "09:00", endTime: "10:00", event: "Reunión de equipo" },
      { date: "2025-03-11", startTime: "14:00", endTime: "15:00", event: "Presentación de proyecto" },
    ],
  },
  {
    id: "2",
    name: "Sala B",
    agenda: [
      { date: "2025-03-10", startTime: "10:00", endTime: "11:00", event: "Entrevista de trabajo" },
      { date: "2025-03-12", startTime: "16:00", endTime: "17:00", event: "Taller de capacitación" },
    ],
  },
];

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingDialog({ open, onClose }: BookingDialogProps) {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]); // Sala seleccionada
  const [currentWeek, setCurrentWeek] = useState(new Date()); // Semana actual
  const [isComboboxOpen, setIsComboboxOpen] = useState(false); // Estado para abrir/cerrar el Combobox
  const [selectedSlots, setSelectedSlots] = useState<{ [date: string]: { start: string; end: string } | null }>({}); // Horarios seleccionados por día

  // Obtener los días de la semana actual
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Lunes como primer día de la semana
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: addWeeks(startOfCurrentWeek, 1),
  }).slice(0, 5); // Solo días laborables (Lunes a Viernes)

  // Filtrar eventos de la agenda para la semana actual
  const eventsForSelectedWeek = selectedRoom.agenda.filter((event) =>
    daysOfWeek.some((day) => event.date === format(day, "yyyy-MM-dd"))
  );

  // Generar horas del día con subdivisiones de 15 minutos (de 8:00 AM a 8:00 PM)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // Horas de 8 a 20 (8 PM)
  const minutes = ["00", "15", "30", "45"]; // Subdivisiones de 15 minutos

  // Función para manejar la selección de un horario
  const handleSlotSelection = (date: string, time: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const currentSlot = prevSelectedSlots[date];
      if (!currentSlot) {
        return { ...prevSelectedSlots, [date]: { start: time, end: time } };
      } else {
        return { ...prevSelectedSlots, [date]: { ...currentSlot, end: time } };
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[80vh] flex flex-col"> {/* Ajuste de tamaño */}
        <DialogHeader>
          <DialogTitle>Reservar Sala</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 flex flex-col overflow-auto">
          {/* Combobox para seleccionar la sala */}
          <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isComboboxOpen}
                className="w-full justify-between"
              >
                {selectedRoom.name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar sala..." />
                <CommandList>
                  {rooms.map((room) => (
                    <CommandItem
                      key={room.id}
                      value={room.name}
                      onSelect={() => {
                        setSelectedRoom(room);
                        setIsComboboxOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedRoom.id === room.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {room.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Navegación de semanas */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              Semana del {format(startOfCurrentWeek, "dd MMM yyyy")}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Vista semanal con scroll */}
          <div className="flex-1 overflow-auto"> {/* Scroll vertical */}
            <div className="flex">
              {/* Columna de horas */}
              <div className="w-16">
                <div className="h-12"></div> {/* Espacio para los días */}
                {hours.map((hour) =>
                  minutes.map((minute) => (
                    <div key={`${hour}:${minute}`} className="h-8 text-sm text-gray-500">
                      {minute === "00" ? `${hour}:${minute}` : ""}
                    </div>
                  ))
                )}
              </div>

              {/* Columnas de días */}
              {daysOfWeek.map((day) => (
                <div key={day.toISOString()} className="flex-1">
                  <div className="h-12 text-center font-semibold">
                    {format(day, "EEE dd")}
                  </div>
                  {hours.map((hour) =>
                    minutes.map((minute) => {
                      const time = `${hour}:${minute}`;
                      const event = eventsForSelectedWeek.find(
                        (event) =>
                          event.date === format(day, "yyyy-MM-dd") &&
                          event.startTime <= time &&
                          event.endTime > time
                      );
                      const selectedSlot = selectedSlots[format(day, "yyyy-MM-dd")];
                      return (
                        <div
                          key={`${day.toISOString()}-${time}`}
                          className={`h-8 border ${
                            selectedSlot &&
                            selectedSlot.start <= time &&
                            selectedSlot.end >= time
                              ? "bg-blue-100"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleSlotSelection(format(day, "yyyy-MM-dd"), time)}
                        >
                          {event && (
                            <div className="bg-blue-100 p-1 rounded-md">
                              <p className="text-sm font-medium">{event.event}</p>
                              <p className="text-xs text-gray-500">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botón para guardar */}
          <Button
            className="w-full"
            onClick={() => {
              console.log("Reservas seleccionadas:", selectedSlots);
              onClose();
            }}
          >
            Guardar Reserva
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}