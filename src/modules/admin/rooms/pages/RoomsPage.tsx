import { RoomsDataTable } from "../components/RoomsDataTable"

export default function RoomsPage() {
	return (
		<main className="flex flex-col items-center gap-4 bg-gray-100">
			<h1 className="w-full text-2xl font-semibold">Salas</h1>
			<section className="flex h-full w-full flex-col justify-between rounded-2xl bg-white px-4 shadow-md">
					<RoomsDataTable />
			</section>
		</main>
	)
}
