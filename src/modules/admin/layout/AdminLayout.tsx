import NavBar from "@/modules/core/components/Headers/NavBar"
import LayoutSlot from "@/modules/core/components/Slots/LayoutSlot"
import PrivateLayout from "@/modules/shared/layout/PrivateLayout"

interface Props {
	children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
	const navLinks = [
		{ label: "Listado de asignaturas", href: "/admin/asignaturas" },
		{ label: "Listado de clases", href: "/admin/clases" },
		{ label: "Listado de cuentas", href: "/admin/usuarios" },
		{ label: "Listado de salas", href: "/admin/salas" },
		{ label: "Listado de videos", href: "/admin/videos" },
	]

	return (
		<PrivateLayout>
			<LayoutSlot name="header">
				<NavBar navLinks={navLinks} />
			</LayoutSlot>
			{children}
		</PrivateLayout>
	)
}
