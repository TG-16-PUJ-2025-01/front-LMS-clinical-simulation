import { RoomsDataTable } from "../components/RoomsDataTable"
import { ComboboxSelect } from "@/modules/admin/rooms/components/combobox-select"
import { useEffect, useState } from "react"
import { addRoomType, getRoomsTypes } from "../services/roomService"
import RoomType from "@/modules/core/models/roomType"

export default function RoomsPage() {
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
			<main className="flex flex-col items-center gap-4 bg-gray-100">
				<h1 className="w-full text-2xl font-semibold">Salas</h1>
				<section className="flex h-full w-full flex-col justify-between rounded-2xl bg-white px-4 shadow-md">
					<div className="flex-grow">
						<RoomsDataTable />
					</div>
					<ComboboxSelect
						options={data.map((roomType) => ({ key: roomType.id, value: roomType.name }))}
						onCreateOption={handleOnCreateOption}
						placeholderText="Seleccionar tipo..."
						itemName="tipo de sala"
					/>
				</section>
			</main>
		</>
	)
}
