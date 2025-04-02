import { useEffect, useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createSimulations, getAllRooms } from "../services/bookingService";
import { useParams } from "react-router-dom";
import Practice from "@/modules/core/models/practice";
import { getPracticeById } from "../../../shared/practices/services/PracticeService";

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

export default function CreateSimulationsForm({ onClose }: CreateSimulationsFormProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [rooms, setRooms] = useState<{ key: number; value: string }[]>([]);
  const practiceId = useParams<{ id: string }>().id;
  const [practice, setPractice] = useState<Practice | null>(null);
  const [timeOptions, setTimeOptions] = useState<{ key: number; value: string }[]>([]);


  useEffect(() => {
    
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        const formattedRooms = roomsData.map((room: Room) => ({
          key: room.id,
          value: room.name,
        }));
        setRooms(formattedRooms);

        if (formattedRooms.length > 0) {
          setSelectedRoom({ id: formattedRooms[0].key, name: formattedRooms[0].value });
        }
      } catch (error) {
        console.error("Error cargando salas:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const res = await getPracticeById(Number(practiceId));
        setPractice(res.data);
      } catch (error) {
        console.error("Error cargando la práctica:", error);
      }
    };
    fetchPractice();
  }, [practiceId]);


  useEffect(() => {
    if (!practice?.simulationDuration) return;

    const interval = practice.simulationDuration; // Duración de la simulación en minutos
    const times: { key: number; value: string }[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push({ key: hour * 100 + minute, value: time });
      }
    }
    
    setTimeOptions(times);
  }, [practice?.simulationDuration]);

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
      toast.error("No hay reservas para guardar.");
      return;
    }

    const requestData = {
      simulations: reservations.map((res) => ({
        practiceId: Number(practiceId),
        roomId: res.room,
        startDateTime: `${res.date}T${res.startTime}:00`,
        endDateTime: `${res.date}T${res.endTime}:00`,
      })),
    };

    try {
      await createSimulations(requestData);
      toast.success("Reservas guardadas con éxito.");
      setReservations([]);
      onClose();
    } catch (err) {
      console.error("Error al enviar reservas:", err);
      toast.error("No se pudo guardar las reservas.");
    }
  };

  function totalTimeToBook() {
    return practice?.numberOfGroups && practice?.simulationDuration ? practice.numberOfGroups * practice.simulationDuration : 0;
  }

  return (
    <div className="w-1/3 border rounded-lg p-4 flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Reserva de salas</h3>

      <p className="text-sm text-gray-500">
        Reserva los espacios para las simulaciones de los estudiantes. El sistema asigna automáticamente un espacio a cada estudiante o grupo según la duración de la práctica. No es necesario reservar cada evaluación por separado.
      </p>

      <ul className="text-sm text-gray-500 list-disc list-inside">
        <li><span className="font-semibold">Número de grupos:</span> {practice?.numberOfGroups}</li>
        <li><span className="font-semibold">Duración de cada práctica:</span> {practice?.simulationDuration} minutos</li>
        <li><span className="font-semibold">Total de minutos a reservar:</span> {totalTimeToBook()} minutos</li>
      </ul>

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

      {/* Selección de horas */}
      <Combobox
        options={timeOptions}
        placeholderText="Seleccionar hora de inicio"
        itemName="Hora"
        onChange={(selected) => setStartTime(selected.value)}
        selectedValue={startTime}
      />

      <Combobox
        options={timeOptions}
        placeholderText="Seleccionar hora de finalización"
        itemName="Hora"
        onChange={(selected) => setEndTime(selected.value)}
        selectedValue={endTime}
      />

      {/* Selección de sala */}
      <Combobox
        options={rooms}
        placeholderText="Seleccionar sala"
        itemName="Sala"
        onChange={(selected) => {
          const selectedRoomData = rooms.find((room) => room.key === selected.key);
          if (selectedRoomData) {
            setSelectedRoom({ id: selectedRoomData.key, name: selectedRoomData.value });
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
