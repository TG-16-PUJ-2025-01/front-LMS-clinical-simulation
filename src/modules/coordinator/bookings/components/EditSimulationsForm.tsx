import { useEffect, useState } from "react";
import { Button } from "@/modules/core/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/modules/core/components/ui/calendar";
import { toast } from "sonner";
import { editSimulationById, getAllRooms, getPracticeById } from "../services/bookingService";
import { useParams } from "react-router-dom";
import Practice from "@/modules/core/models/practice";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Combobox } from "@/modules/core/components/Combobox/Combobox";
import Simulation from "@/modules/core/models/simulation";

interface EditSimulationsFormProps {
  onClose: () => void;
  simulation: Simulation;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

interface RoomOption {
  value: number;
  label: string;
}

export default function EditSimulationsForm({ onClose, simulation, selectedDate, setSelectedDate }: EditSimulationsFormProps) {
  const [selectedRooms, setSelectedRooms] = useState<RoomOption[]>(
    simulation.rooms.map(room => ({ 
      value: room.id, 
      label: room.name 
    })) || []
  );

  // Formatear las horas iniciales desde la simulación
  const initialStartTime = format(new Date(simulation.startDateTime), 'HH:mm');
  const initialEndTime = format(new Date(simulation.endDateTime), 'HH:mm');

  const [startTime, setStartTime] = useState<string>(initialStartTime);
  const [endTime, setEndTime] = useState<string>(initialEndTime);

  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const practiceId = useParams<{ id: string }>().id;
  const [practice, setPractice] = useState<Practice | null>(null);
  const [timeOptions, setTimeOptions] = useState<{ key: number; value: string }[]>([]);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getAllRooms();
        const formattedRooms = roomsData.map((room) => ({ 
          value: room.id, 
          label: room.name 
        }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error("Error cargando salas:", error);
        toast.error("Error al cargar las salas disponibles");
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
        toast.error("Error al cargar los detalles de la práctica");
      }
    };
    fetchPractice();
  }, [practiceId]);

  useEffect(() => {
    if (!practice?.simulationDuration) return;

    const interval = practice.simulationDuration; 
    const times: { key: number; value: string }[] = [];

    for (let hour = 6; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push({ key: hour * 100 + minute, value: time });
      }
    }

    setTimeOptions(times);
  }, [practice?.simulationDuration]);

  const handleTimeChange = (time: string, isStartTime: boolean) => {
    if (isStartTime) {
      setStartTime(time);
      
      // Actualizar la fecha seleccionada con la nueva hora de inicio
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
    } else {
      setEndTime(time);
    }
  };

  const saveSimulation = async () => {
    if (!selectedDate || !startTime || !endTime || selectedRooms.length === 0) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    try {
      const startDateTime = new Date(selectedDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);
      
      const endDateTime = new Date(selectedDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);

      if (endDateTime <= startDateTime) {
        toast.error("La hora de finalización debe ser posterior a la hora de inicio");
        return;
      }

      const requestData = {
        practiceId: Number(practiceId),
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        roomIds: selectedRooms.map(room => room.value),
      };

      await editSimulationById(simulation.simulationId, requestData);
      toast.success("Simulación actualizada con éxito.");
      onClose();
    } catch (err) {
      console.error("Error al actualizar simulación:", err);
      toast.error("No se pudo actualizar la simulación.");
    }
  };

  return (
    <div className="w-2/5 border rounded-lg p-4 flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Editar Simulación</h3>

      <p className="text-sm text-gray-500">
        Actualiza los detalles de la simulación. El sistema ajustará los bloques según la duración de la práctica.
      </p>

      <ul className="text-sm text-gray-500 list-disc list-inside">
        <li><span className="font-semibold">Duración de la práctica:</span> {practice?.simulationDuration} minutos</li>
      </ul>

      {/* DatePicker sincronizado */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar 
            mode="single" 
            selected={selectedDate} 
            onSelect={(date) => {
              if (date) {
                // Mantener la hora actual al cambiar la fecha
                const newDate = new Date(date);
                const [hours, minutes] = startTime.split(':').map(Number);
                newDate.setHours(hours, minutes);
                setSelectedDate(newDate);
              }
            }} 
            locale={es} 
          />
        </PopoverContent>
      </Popover>

      {/* Start Time */}
      <Combobox
        options={timeOptions}
        placeholderText="Hora de inicio"
        itemName="Hora"
        onChange={(selected) => handleTimeChange(selected.value, true)}
        selectedValue={startTime}
        defaultValue={startTime}
      />

      {/* End Time */}
      <Combobox
        options={timeOptions}
        placeholderText="Hora de finalización"
        itemName="Hora"
        onChange={(selected) => handleTimeChange(selected.value, false)}
        selectedValue={endTime}
        defaultValue={endTime}
      />

      {/* Room Selection */}
      <Select
        components={animatedComponents}
        isMulti
        options={rooms}
        value={selectedRooms}
        onChange={(selected) => setSelectedRooms(selected as RoomOption[])}
        placeholder="Seleccionar salas"
        className="w-full min-w-40 rounded-md p-0"
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            "borderColor": "",
            "borderRadius": "var(--radius)",
            "boxShadow": "",
            "&:hover": { borderColor: "" },
            "&:focus": { borderColor: "black" },
          }),
        }}
        classNames={{
          control: () =>
            "flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        }}
        noOptionsMessage={() => "No se encontraron salas"}
      />

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="w-full"
        >
          Cancelar
        </Button>
        <Button 
          onClick={saveSimulation} 
          className="w-full azul-javeriana text-white"
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}