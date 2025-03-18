import { useEffect, useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createSimulations, getAllRooms } from "../services/bookingService";

interface CreateSimulationsFormProps {
  onClose: () => void;
}

interface Room {
  id: number;
  name: string;
}

interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  room: number;
}

const generateTimeOptions = () => {
  const times: { key: string; value: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of ["00", "15", "30", "45"]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
      times.push({ key: time, value: time });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export default function CreateSimulationsForm({ onClose }: CreateSimulationsFormProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [rooms, setRooms] = useState<{ key: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        const formattedRooms = roomsData.map((room) => ({
          key: room.id.toString(),
          value: room.name,
        }));
        setRooms(formattedRooms);

        if (formattedRooms.length > 0) {
          setSelectedRoom({ id: parseInt(formattedRooms[0].key), name: formattedRooms[0].value });
        }
      } catch (error) {
        console.error("Error cargando salas:", error);
      }
    };

    fetchRooms();
  }, []);

  const addReservation = () => {
    if (!selectedDate || !startTime || !endTime || !selectedRoom) {
      toast.error("Por favor, completa todos los campos antes de agregar la reserva.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("La hora de inicio debe ser anterior a la de finalización.");
      return;
    }

    const newReservation: Reservation = {
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      room: selectedRoom.id,
    };

    const isDuplicate = reservations.some(
      (res) =>
        res.date === newReservation.date &&
        res.startTime === newReservation.startTime &&
        res.endTime === newReservation.endTime &&
        res.room === newReservation.room
    );

    if (isDuplicate) {
      toast.error("Esta reserva ya ha sido añadida.");
      return;
    }

    setReservations((prev) => [...prev, newReservation]);
    setStartTime("");
    setEndTime("");
  };

  const saveReservations = async () => {
    if (reservations.length === 0) {
      setError("No hay reservas para guardar.");
      return;
    }

    const requestData = {
      simulations: reservations.map((res) => ({
        practiceId: 1,
        roomId: res.room,
        startDateTime: `${res.date}T${res.startTime}:00`,
        endDateTime: `${res.date}T${res.endTime}:00`,
      })),
    };

    try {
      await createSimulations(requestData);
      toast.success("Reservas guardadas con éxito.");
      setReservations([]);
      setError(null);
      onClose();
    } catch (err) {
      console.error("Error al enviar reservas:", err);
      setError("Hubo un problema al guardar las reservas.");
      toast.error("No se pudo guardar las reservas.");
    }
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={es} />
        </PopoverContent>
      </Popover>

      {/* Selección de hora de inicio con Combobox */}
      <Combobox
        options={timeOptions}
        placeholderText="Seleccionar hora de inicio"
        itemName="Hora"
        onChange={(selected) => setStartTime(selected.key)}
        selectedValue={startTime}
      />

      {/* Selección de hora de finalización con Combobox */}
      <Combobox
        options={timeOptions}
        placeholderText="Seleccionar hora de finalización"
        itemName="Hora"
        onChange={(selected) => setEndTime(selected.key)}
        selectedValue={endTime}
      />

      {/* Selección de sala con Combobox */}
      <Combobox
        options={rooms}
        placeholderText="Seleccionar sala"
        itemName="Sala"
        onChange={(selected) => {
          const selectedRoomData = rooms.find((room) => room.key === selected.key);
          if (selectedRoomData) {
            setSelectedRoom({ id: parseInt(selectedRoomData.key), name: selectedRoomData.value });
          }
        }}
        selectedValue={selectedRoom?.name || ""}
      />

      <Button onClick={addReservation} variant="secondary" className="w-full azul-javeriana">
        Añadir reserva al carrito
      </Button>

      <div className="border p-2 rounded h-32 overflow-auto">
        {reservations.length > 0 ? (
          reservations.map((res, index) => (
            <div key={index} className="border-b p-1 flex justify-between items-center">
              <p>{res.date} ({res.startTime} - {res.endTime}) - Sala {res.room}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReservations((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay reservas en el carrito aún</p>
        )}
      </div>

      <Button onClick={saveReservations} className="w-full azul-javeriana text-white">
        Finalizar reserva
      </Button>
    </div>
  );
}
