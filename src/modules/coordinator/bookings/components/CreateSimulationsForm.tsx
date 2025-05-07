import { useEffect, useState } from "react"
import { Button } from "@/modules/core/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/modules/core/components/ui/calendar"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createSimulations, getAllRooms, getPracticeById } from "../services/bookingService"
import { useParams } from "react-router-dom"
import Practice from "@/modules/core/models/practice"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"

interface CreateSimulationsFormProps {
	onClose: () => void
	selectedDate: string | undefined
	setDate: (date: string) => void
  onReservationsUpdated: () => void
}

interface Room {
	value: number
	label: string
}

interface Reservation {
	date: string
	startTime: string
	endTime: string
	roomIds: number[]
	spaces: number
}

export default function CreateSimulationsForm({ onClose, setDate, onReservationsUpdated }: CreateSimulationsFormProps) {
	const [reservations, setReservations] = useState<Reservation[]>([])
	const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
	const [startTime, setStartTime] = useState<string>("")
	const [endTime, setEndTime] = useState<string>("")
	const [rooms, setRooms] = useState<Room[]>([])
	const { practiceId } = useParams<{ classId: string; practiceId: string }>()
	const [practice, setPractice] = useState<Practice | null>(null)
	const [timeOptions, setTimeOptions] = useState<{ key: number; value: string }[]>([])
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
	const animatedComponents = makeAnimated()

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const roomsData = await getAllRooms()
				const formattedRooms = roomsData.map((room) => ({ value: room.id, label: room.name }))
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

	const addReservation = () => {
		if (!selectedDate || !startTime || !endTime || selectedRooms.length === 0) {
			toast.error("Por favor, completa todos los campos antes de agregar la reserva.")
			return
		}

		if (startTime >= endTime) {
			toast.error("La hora de inicio debe ser anterior a la de finalización.")
			return
		}

		const [startHour, startMinute] = startTime.split(":").map(Number)
		const [endHour, endMinute] = endTime.split(":").map(Number)
		const reservationDuration = endHour * 60 + endMinute - (startHour * 60 + startMinute)

		const spaces = practice?.simulationDuration
			? Math.ceil(reservationDuration / practice.simulationDuration)
			: 0

		const newReservation: Reservation = {
			date: format(selectedDate, "yyyy-MM-dd"),
			startTime,
			endTime,
			roomIds: selectedRooms.map((room) => room.value),
			spaces,
		}

		const isDuplicate = reservations.some(
			(res) =>
				res.date === newReservation.date &&
				res.startTime === newReservation.startTime &&
				res.endTime === newReservation.endTime &&
				JSON.stringify(res.roomIds) === JSON.stringify(newReservation.roomIds)
		)

		if (isDuplicate) {
			toast.error("Esta reserva ya ha sido añadida.")
			return
		}

		setReservations((prev) => [...prev, newReservation])
		setStartTime("")
		setEndTime("")
	}

	const saveReservations = async () => {
		const totalSpacesInCart = reservations.reduce((sum, res) => sum + res.spaces, 0)
		const totalSpacesRequired = practice?.numberOfGroups || 0

		if (totalSpacesInCart < totalSpacesRequired) {
			toast.error("No ha reservado los suficientes espacios para los estudiantes.")
			return
		}

		if (reservations.length === 0) {
			toast.error("No hay reservas para guardar.")
			return
		}

		const requestData = {
			simulations: reservations.map((res) => ({
				practiceId: Number(practiceId),
				roomIds: res.roomIds,
				startDateTime: `${res.date}T${res.startTime}:00`,
				endDateTime: `${res.date}T${res.endTime}:00`,
			})),
		}

		console.log("Request data:", requestData)

		try {
			await createSimulations(requestData)
			toast.success("Reservas guardadas con éxito.")
			setReservations([])
      onReservationsUpdated();
			onClose()
		} catch (err) {
			console.error("Error al enviar reservas:", err)
			toast.error("No se pudo guardar las reservas.")
		}
	}

	function totalTimeToBook() {
		return practice?.numberOfGroups && practice?.simulationDuration
			? practice.numberOfGroups * practice.simulationDuration
			: 0
	}

	const totalSpacesInCart = reservations.reduce((sum, res) => sum + res.spaces, 0)
	const totalSpacesRequired = practice?.numberOfGroups || 0

	return (
		<div className="flex w-2/5 flex-col space-y-4 rounded-lg border p-4">
			<h4 className="text-lg font-semibold">Reserva de salas</h4>

			<p className="text-sm text-gray-500">
				Se debe reservar el total de minutos indicado, el sistema los dividirá en bloques de acuerdo
				a la duración de la práctica.
			</p>

			<ul className="list-inside list-disc text-sm text-gray-500">
				<li>
					<span className="font-semibold">Número de grupos:</span> {practice?.numberOfGroups}
				</li>
				<li>
					<span className="font-semibold">Duración de cada práctica:</span>{" "}
					{practice?.simulationDuration} minutos
				</li>
				<li>
					<span className="font-semibold">Total de minutos a reservar:</span> {totalTimeToBook()}{" "}
					minutos
				</li>
			</ul>

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
							setSelectedDate(date ?? undefined)
							setDate(format(date ?? new Date(), "yyyy-MM-dd"))
						}}
						locale={es}
					/>
				</PopoverContent>
			</Popover>

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

			<Select
				components={animatedComponents}
				isMulti
				options={rooms}
				value={selectedRooms}
				onChange={(newValue) => setSelectedRooms(newValue as Room[])}
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

			<Button onClick={addReservation} variant="secondary" className="azul-javeriana w-full">
				Añadir reserva al carrito
			</Button>

			<div className="h-full overflow-auto rounded border p-2">
				{reservations.length > 0 ? (
					reservations.map((res, index) => {
						const roomNames = res.roomIds
							.map((id) => rooms.find((room) => room.value === id)?.label)
							.filter((name) => name)

						return (
							<div key={index} className="flex items-center justify-between border-b p-1">
								<p>
									{res.date} ({res.startTime} - {res.endTime}) - {roomNames.join(", ")} - (
									{res.spaces} espacios)
								</p>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setReservations((prev) => prev.filter((_, i) => i !== index))}
								>
									<Trash2 className="h-4 w-4 text-red-500" />
								</Button>
							</div>
						)
					})
				) : (
					<p className="text-gray-500">No hay reservas en el carrito aún</p>
				)}
			</div>

			<div className="text-sm text-gray-700">
				<p>
					<span className="font-semibold">Número de espacios en el carrito:</span>{" "}
					{totalSpacesInCart}
				</p>
				<p>
					<span className="font-semibold">Número de espacios mínimos a reservar:</span>{" "}
					{totalSpacesRequired}
				</p>
			</div>

			<Button onClick={saveReservations} className="azul-javeriana w-full text-white">
				Finalizar reserva
			</Button>
		</div>
	)
}
