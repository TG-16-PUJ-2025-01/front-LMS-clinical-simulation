import { useEffect, useState } from "react"
import { Button } from "@/modules/core/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/modules/core/components/ui/calendar"
import { toast } from "sonner"
import { editSimulationById, getAllRooms, getPracticeById } from "../services/bookingService"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import Simulation from "@/modules/core/models/simulation"

interface EditSimulationsFormProps {
	onClose: () => void
	simulation: Simulation
}

interface RoomOption {
	value: number
	label: string
}

export default function EditSimulationsForm({ onClose, simulation }: EditSimulationsFormProps) {
	const [selectedRooms, setSelectedRooms] = useState<RoomOption[]>(
		simulation.rooms.map((room) => ({
			value: room.id,
			label: room.name,
		})) || []
	)

	const [selectedDate, setSelectedDate] = useState<Date>(new Date(simulation.startDateTime))

	const [startTime, setStartTime] = useState<string>(
		format(new Date(simulation.startDateTime), "HH:mm")
	)

	const [endTime, setEndTime] = useState<string>(format(new Date(simulation.endDateTime), "HH:mm"))

	const [rooms, setRooms] = useState<RoomOption[]>([])
	const { practiceId } = useParams<{ classId: string; practiceId: string }>()
	const [practice, setPractice] = useState<Practice | null>(null)
	const [timeOptions, setTimeOptions] = useState<{ key: number; value: string }[]>([])
	const animatedComponents = makeAnimated()

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const roomsData = await getAllRooms()
				const formattedRooms = roomsData.map((room) => ({
					value: room.id,
					label: room.name,
				}))
				setRooms(formattedRooms)
			} catch (error) {
				console.error("Error cargando salas:", error)
			}
		}
		fetchRooms()
	}, [])

	useEffect(() => {
		const fetchPractice = async () => {
			try {
				const res = await getPracticeById(Number(practiceId))
				setPractice(res.data)
			} catch (error) {
				console.error("Error cargando la práctica:", error)
			}
		}
		fetchPractice()
	}, [practiceId])

	useEffect(() => {
		if (!practice?.simulationDuration) return

		const interval = practice.simulationDuration
		const times: { key: number; value: string }[] = []

		for (let hour = 6; hour < 20; hour++) {
			for (let minute = 0; minute < 60; minute += interval) {
				const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
				times.push({ key: hour * 100 + minute, value: time })
			}
		}

		setTimeOptions(times)
	}, [practice?.simulationDuration])

	const saveSimulation = async () => {
		if (!selectedDate || !startTime || !endTime || selectedRooms.length === 0) {
			toast.error("Por favor completa todos los campos.")
			return
		}

		try {
			const startDateTime = new Date(selectedDate)
			const [startHours, startMinutes] = startTime.split(":").map(Number)
			startDateTime.setHours(startHours, startMinutes)

			const endDateTime = new Date(selectedDate)
			const [endHours, endMinutes] = endTime.split(":").map(Number)
			endDateTime.setHours(endHours, endMinutes)
			console.log("simulation", simulation)
			const requestData = {
				practiceId: Number(practiceId),
				startDateTime: startDateTime.toISOString(),
				endDateTime: endDateTime.toISOString(),
				roomIds: selectedRooms.map((room) => room.value),
			}

			await editSimulationById(simulation.simulationId, requestData)
			toast.success("Reserva actualizada exitosamente")
			onClose()
		} catch (err) {
			console.error("Error al actualizar simulación:", err)
			toast.error("No se pudo actualizar la simulación.")
		}
	}

	return (
		<div className="flex w-2/5 flex-col space-y-4 rounded-lg border p-4">
			<h3 className="text-lg font-semibold">Editar Simulación</h3>

			<p className="text-sm text-gray-500">
				Actualiza los detalles de la simulación. El sistema ajustará los bloques según la duración
				de la práctica.
			</p>

			<ul className="list-inside list-disc text-sm text-gray-500">
				<li>
					<span className="font-semibold">Duración de la práctica:</span>{" "}
					{practice?.simulationDuration} minutos
				</li>
			</ul>

			{/* DatePicker */}
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
							if (!date) return
							setSelectedDate(date)
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
				onChange={(selected) => setStartTime(selected?.value ?? "")}
				selectedValue={startTime}
			/>

			{/* End Time */}
			<Combobox
				options={timeOptions}
				placeholderText="Hora de finalización"
				itemName="Hora"
				onChange={(selected) => setEndTime(selected?.value ?? "")}
				selectedValue={endTime}
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
				<Button variant="outline" onClick={onClose} className="w-full">
					Cancelar
				</Button>
				<Button onClick={saveSimulation} className="azul-javeriana w-full text-white">
					Guardar Cambios
				</Button>
			</div>
		</div>
	)
}
