import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { MainMenuDataTable } from "../components/MainMenuDataTable"
import { useState } from "react"
import { Button } from "@/modules/core/components/ui/button"

export default function MainMenuPage() {
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

	const resetFilters = () => {
		setSelectedYear(null)
		setSelectedPeriod(null)
	}

	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Calendario",
							href: "/calendario",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Tus Clases</LayoutSlot>
			<div className="mb-4 flex justify-end items-center gap-4">
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
					onChange={(selected) => setSelectedPeriod(selected.value ? Number(selected.value) : null)}
				/>
				<Button variant="default" onClick={resetFilters}>
					Resetear Filtros
				</Button>
			</div>
			<MainMenuDataTable selectedYear={selectedYear} selectedPeriod={selectedPeriod} />
		</>
	)
}
