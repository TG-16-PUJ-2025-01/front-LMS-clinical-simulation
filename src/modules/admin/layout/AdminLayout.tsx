import NavBar from "@/modules/core/components/Headers/NavBar"
import { Toaster } from "sonner"

interface Props {
	children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
	const navLinks = [
		{ label: "Listado de asignaturas", href: "/admin/asignaturas" },
		{ label: "Listado de clases", href: "/admin/clases" },
		{ label: "Listado de cuentas", href: "/admin/cuentas" },
		{ label: "Listado de salas", href: "/admin/salas" },
		{ label: "Listado de videos", href: "/admin/videos" },
	]

	return (
		<div className="min-h-screen bg-gray-100">
			<NavBar navLinks={navLinks} />
			<div className="container mx-auto p-4">{children}</div>
			<Toaster />
		</div>
	)
}
