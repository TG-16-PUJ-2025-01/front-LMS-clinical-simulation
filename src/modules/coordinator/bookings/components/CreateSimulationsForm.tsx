import { useEffect, useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/modules/core/components/ui/command";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";
import { getAllRooms } from "../services/bookingService";


// 📌 Definición de tipos
interface Room {
  id: string;
  name: string;
}

interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  room: string;    
}

// 📌 Generar opciones de horario (cada 15 minutos)
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of ["00", "15", "30", "45"]) {
      times.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    } 
  }
  return times;
};

const timeOptions = generateTimeOptions();

export default function CreateSimulationsForm() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [rooms, setRooms] = useState<{ key: string; value: string }[]>([]); 

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

    fetchRooms();
  }, []);

  const addReservation = () => {
    if (!selectedDate || !startTime || !endTime || !selectedRoom) return;

    const newReservation: Reservation = {
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      room: selectedRoom.name,
    };

    setReservations((prev) => [...prev, newReservation]);
    setStartTime("");
    setEndTime("");
  };

  const saveReservations = () => {
    console.log("Reservas guardadas:", reservations);
    alert("Reservas guardadas con éxito");
  };

  return (
    <div className="w-1/3 border rounded-lg p-4 flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Reserva de salas</h3>
      <p className="text-sm text-gray-500">
        Reserva los espacios para las simulaciones de los estudiantes. El sistema asigna automáticamente un espacio a cada estudiante o grupo según la duración de la práctica. No es necesario reservar cada evaluación por separado.
      </p>

      {/* DatePicker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      {/* Selección de hora de inicio */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {startTime || "Selecciona hora de inicio"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar hora..." />
            <CommandList className="max-h-48 overflow-auto">
              {timeOptions.map((time) => (
                <CommandItem key={time} value={time} onSelect={() => setStartTime(time)}>
                  <Check className={`mr-2 h-4 w-4 ${startTime === time ? "opacity-100" : "opacity-0"}`} />
                  {time}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selección de hora de finalización */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {endTime || "Selecciona hora de finalización"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar hora..." />
            <CommandList className="max-h-48 overflow-auto">
              {timeOptions.map((time) => (
                <CommandItem key={time} value={time} onSelect={() => setEndTime(time)}>
                  <Check className={`mr-2 h-4 w-4 ${endTime === time ? "opacity-100" : "opacity-0"}`} />
                  {time}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selección de sala con Combobox */}

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


      {/* Botón de añadir */}
      <Button onClick={addReservation} variant="secondary" className="w-full azul-javeriana">
        Añadir reserva al carrito
      </Button>

      {/* Lista de reservas */}
      <div className="border p-2 rounded h-32 overflow-auto">
        {reservations.length > 0 ? (
          reservations.map((res, index) => (
            <div key={index} className="border-b p-1 flex justify-between items-center">
              <p>{res.date} ({res.startTime} - {res.endTime})</p>
              <Button variant="ghost" size="sm" onClick={() => setReservations((prev) => prev.filter((_, i) => i !== index))}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay reservas en el carrito aún</p>
        )}
      </div>

      {/* Botón de guardar todas */}
      <Button onClick={saveReservations} className="w-full to-blue-javeriana text-white">
        Finalizar reserva
      </Button>
    </div>
  );
}
