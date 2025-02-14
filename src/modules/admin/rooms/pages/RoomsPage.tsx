import { RoomsDataTable } from "../components/RoomsDataTable"
import NavBar from "@/modules/core/components/Headers/NavBar"
import { Toaster } from "@/modules/core/components/ui/sonner"

export default function RoomsPage() {

	const navLinks = [
		{ label: "Listado de materias", href: "/admin/" },
		{ label: "Listado de clases", href: "/admin/clases" },
		{ label: "Listado de cuentas", href: "/admin/users" },
		{ label: "Listado de salas", href: "#" },
    	{ label: "Listado de videos", href: "/admin/videos" },
	]

	return (
		<>
			<NavBar navLinks={navLinks} />
			<main className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
				<div className="w-full max-w-6xl mb-4">
					<h1 className="text-2xl font-semibold">Salas</h1>
				</div>
				<div className="w-full max-w-6xl p-4 bg-white rounded-lg shadow-md flex flex-col justify-between h-full">
					<div className="flex-grow">
						<RoomsDataTable />
					</div>
				</div>
			</main>
			<Toaster />
		</>
	)
}