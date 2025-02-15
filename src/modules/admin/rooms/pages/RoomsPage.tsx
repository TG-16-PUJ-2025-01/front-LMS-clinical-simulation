import { RoomsDataTable } from "../components/RoomsDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"
import { ComboboxSelect } from "@/modules/admin/rooms/components/combobox-select"
import { Toaster } from "@/modules/core/components/ui/sonner"
import { useEffect, useState } from "react"
import { addRoomType, getRoomsTypes } from "../services/roomService"
import RoomType from "@/modules/core/models/roomType"

export default function RoomsPage() {
	const navLinks = [
		{ label: "Listado de materias", href: "/admin/" },
		{ label: "Listado de clases", href: "/admin/clases" },
		{ label: "Listado de cuentas", href: "/admin/users" },
		{ label: "Listado de salas", href: "#" },
		{ label: "Listado de videos", href: "/admin/videos" },
	]
	const [data, setData] = useState<RoomType[]>([])

	const handleOnCreateOption = (option: { key: number; value: string }) => {
		addRoomType(option.value)
	}

	useEffect(() => {
		const fetchRoomTypes = async () => {
			const res = await getRoomsTypes()
			setData(res.data)
		}
		fetchRoomTypes()
	}, [])

	return (
		<>
			<NavBar navLinks={navLinks} />
			<main className="flex min-h-screen flex-col items-center bg-gray-100 py-8">
				<div className="mb-4 w-full max-w-6xl">
					<h1 className="text-2xl font-semibold">Salas</h1>
				</div>
				<div className="flex h-full w-full max-w-6xl flex-col justify-between rounded-lg bg-white p-4 shadow-md">
					<div className="flex-grow">
						<RoomsDataTable />
					</div>
					<ComboboxSelect
						options={data.map((roomType) => ({ key: roomType.id, value: roomType.name }))}
						onCreateOption={handleOnCreateOption}
						placeholderText="Seleccionar tipo..."
						itemName="tipo de sala"
					/>
				</div>

				<Toaster />
			</main>
		</>
	)
}
