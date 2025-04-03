import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Class from "@/modules/core/models/class"
import { getMenuInfo } from "@/modules/shared/main-menu/services/MainMenuService"
import { CardClass } from "../../../shared/main-menu/components/CardClass"
import { Button } from "@/modules/core/components/ui/button"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { Input } from "@/modules/core/components/ui/input"
import { Search } from "lucide-react"

export default function MainMenuPage() {
	const navigate = useNavigate()
	const currentYear = new Date().getFullYear()
	const yearOptions = Array.from({ length: 5 }, (_, i) => ({
		key: currentYear - i,
		value: (currentYear - i).toString(),
	}))
	const periodOptions = ["1", "2", "3"].map((period) => ({
		key: Number(period),
		value: period,
	}))

	const [selectedYear, setSelectedYear] = useState<number | null>(null)
	const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
	const [data, setData] = useState<Class[]>([])
	const [filter, setFilter] = useState<string>("")

	const resetFilters = () => {
		setSelectedYear(null)
		setSelectedPeriod(null)
		setFilter("")
	}

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const res = await getMenuInfo(
					selectedYear ?? undefined,
					selectedPeriod ?? undefined,
					filter,
					"professor"
				)
				setData(res.data)
			} catch (error) {
				console.error("Error fetching classes:", error)
			}
		}

		fetchClasses()
	}, [selectedYear, selectedPeriod, filter])

	const handleClassNavigation = (classItem: Class) => {
		navigate(`/profesor/clases/${classItem.classId}/practicas`)
	}

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Calendario",
							href: "/profesor/calendario",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Tus Clases</LayoutSlot>
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="relative w-1/2 max-w-sm">
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar por nombre..."
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
						className="w-full pl-8"
					/>
				</div>
				<div className="flex items-center gap-4">
					<Combobox
						placeholderText="Año"
						options={yearOptions}
						itemName="año"
						selectedValue={selectedYear ? selectedYear.toString() : ""}
						onChange={(selected) => setSelectedYear(selected.value ? Number(selected.value) : null)}
					/>
					<span className="text-xl font-bold">-</span>
					<Combobox
						placeholderText="Periodo"
						options={periodOptions}
						itemName="periodo"
						selectedValue={selectedPeriod ? selectedPeriod.toString() : ""}
						onChange={(selected) =>
							setSelectedPeriod(selected.value ? Number(selected.value) : null)
						}
					/>
					<Button variant="default" onClick={resetFilters}>
						Resetear Filtros
					</Button>
				</div>
			</div>
			<div className="flex justify-center">
				{data.length === 0 ? (
					<p className="text-gray-500">No se encontraron clases</p>
				) : (
					<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
						{data.map((classItem) => (
							<CardClass
								key={classItem.classId}
								classData={classItem}
								onClick={() => handleClassNavigation(classItem)}
							/>
						))}
					</div>
				)}
			</div>
		</>
	)
}
