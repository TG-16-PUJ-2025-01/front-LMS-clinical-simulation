import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import PrivateLayout from "@/modules/shared/layout/PrivateLayout"

interface Props {
	children: React.ReactNode
}

export default function TeacherLayout({ children }: Props) {
	return (
		<PrivateLayout>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Asignaturas",
							href: `/profesor/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/profesor/calendario",
						},
						{
							label: "Rúbricas",
							href: "/profesor/rubricas",
						},
					]}
				/>
			</LayoutSlot>
			{children}
		</PrivateLayout>
	)
}
