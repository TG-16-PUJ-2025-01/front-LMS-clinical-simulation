import { CardDemo } from "@/modules/core/components/Card/CardDemo"
import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"

export default function PracticesPage() {
	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "aqui",
							href: "coordinador/practicas",
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Prácticas</LayoutSlot>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
				<CardDemo />
			</div>
		</>
	)
}
