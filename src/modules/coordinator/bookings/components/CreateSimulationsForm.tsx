import { useEffect, useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createSimulations, getAllRooms, getPracticeById } from "../services/bookingService";
import { useParams } from "react-router-dom";
import Practice from "@/modules/core/models/practice";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";

interface CreateSimulationsFormProps {
  onClose: () => void;
}

interface Room {
  value: number;
  name: string;
}

interface Reservation {
  date: string;
  startTime: string;
  endTime: string;
  roomIds: number[];
}

export default function CreateSimulationsForm({ onClose }: CreateSimulationsFormProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [rooms, setRooms] = useState<{ value: number; label: string }[]>([]);
  const { practiceId } = useParams<{ classId: string; practiceId: string }>();
  const [practice, setPractice] = useState<Practice | null>(null);
  const [timeOptions, setTimeOptions] = useState<{ key: number; value: string }[]>([]);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        const formattedRooms = roomsData.map((room) => ({ value: room.id, label: room.name }));
        setRooms(formattedRooms);
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

    for (let hour = 6; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push({ key: hour * 100 + minute, value: time });
      }
    }

    setTimeOptions(times);
  }, [practice?.simulationDuration]);

  const addReservation = () => {
    if (!selectedDate || !startTime || !endTime || selectedRooms.length === 0) {
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
      roomIds: selectedRooms.map(room => room.value),
    };

    // Verificar si ya existe una reserva con la misma fecha y horarios
    const isDuplicate = reservations.some(
      (res) =>
        res.date === newReservation.date &&
        res.startTime === newReservation.startTime &&
        res.endTime === newReservation.endTime &&
        JSON.stringify(res.roomIds) === JSON.stringify(newReservation.roomIds)
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
        roomIds: res.roomIds,
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
    <div className="w-2/5 border rounded-lg p-4 flex flex-col space-y-4">
      <h4 className="text-lg font-semibold">Reserva de salas</h4>

      <p className="text-sm text-gray-500">
        Se debe reservar el total de minutos indicado, el sistema los dividirá en bloques de acuerdo a la duración de la práctica.
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
        onChange={(selected) => setStartTime(selected?.value || "")}
        selectedValue={startTime}
      />

      <Combobox
        options={timeOptions}
        placeholderText="Seleccionar hora de finalización"
        itemName="Hora"
        onChange={(selected) => setEndTime(selected?.value || "")}
        selectedValue={endTime}
      />

      {/* Selección de sala con react-select */}
      <Select
        components={animatedComponents}
        isMulti
        options={rooms}
        value={selectedRooms}
        onChange={setSelectedRooms}
        placeholder="Seleccionar salas"
        className="w-full min-w-40 rounded-md p-0"
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            "borderColor": "",
            "borderRadius": "var(--radius-md)",
            "boxShadow": "",
            "&:hover": { borderColor: "" },
            "&:focus": { borderColor: "black" },
          }),
        }}
        classNames={{
          control: () =>
            "flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:shadow-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        }}
        noOptionsMessage={() => "No se encontraron salas"}
      />

      <Button onClick={addReservation} variant="secondary" className="w-full azul-javeriana">
        Añadir reserva al carrito
      </Button>

      <div className="border p-2 rounded h-full overflow-auto">
        {reservations.length > 0 ? (
          reservations.map((res, index) => (
            <div key={index} className="border-b p-1 flex justify-between items-center">
              <p>{res.date} ({res.startTime} - {res.endTime}) - Sala {res.roomIds}</p>
              <Button variant="ghost" size="sm" onClick={() => setReservations((prev) => prev.filter((_, i) => i !== index))}>
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


