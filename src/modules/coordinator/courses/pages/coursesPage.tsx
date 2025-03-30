import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import { CoursesDataTable } from "../components/CoursesDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"

export default function coursesPage() {
	return (
		<>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Calendario",
							href: "/calendario",
						},
						{
							label: "Página de inicio de la clase",
							href: `/coordinador/asignaturas`,
						},
					]}
				/>
			</LayoutSlot>
			<LayoutSlot name="title">Mis Asignaturas</LayoutSlot>
			<CoursesDataTable />
		</>
	)
}
