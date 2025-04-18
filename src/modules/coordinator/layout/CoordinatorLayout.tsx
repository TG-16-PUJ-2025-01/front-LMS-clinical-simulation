import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import PrivateLayout from "@/modules/shared/layout/PrivateLayout"

interface Props {
	children: React.ReactNode
}

export default function CoordinatorLayout({ children }: Props) {
	return (
		<PrivateLayout>
			<LayoutSlot name="header">
				<NavBar
					navLinks={[
						{
							label: "Asignaturas",
							href: `/coordinador/asignaturas`,
						},
						{
							label: "Calendario",
							href: "/coordinador/calendario",
						},
						{
							label: "Rúbricas",
							href: "/coordinador/rubricas",
						},
					]}
				/>
			</LayoutSlot>
			{children}
		</PrivateLayout>
	)
}
