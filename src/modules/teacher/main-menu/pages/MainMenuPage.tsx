import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"
import { MainMenuDataTable } from "../components/MainMenuDataTable"

export default function MainMenuPage() {
	const currentYear = new Date().getFullYear()
	const yearOptions = Array.from({ length: 5 }, (_, i) => ({
		key: currentYear - i,
		value: (currentYear - i).toString(),
	}))
	const periodOptions = ["10", "20", "30"].map((period) => ({
		key: Number(period),
		value: period,
	}))

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
			<LayoutSlot name="title">Menú Principal</LayoutSlot>
			<div className="mb-4 flex justify-end gap-4">
				<Combobox
					placeholderText="Selecciona Año"
					options={yearOptions}
					itemName="año"
				/>
				<Combobox
					placeholderText="Selecciona Periodo"
					options={periodOptions}
					itemName="periodo"
				/>
			</div>
			<MainMenuDataTable />
		</>
	)
}
