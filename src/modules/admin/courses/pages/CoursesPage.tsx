import { CoursesDataTable } from "../components/CoursesDataTable"

export default function CoursesPage() {
	return (
		<main className="flex flex-col items-center gap-4">
			<h1 className="w-full text-2xl font-semibold">Materias</h1>
			<section className="flex h-full w-full flex-col justify-between rounded-2xl bg-white px-4 shadow-md">
				<CoursesDataTable />
			</section>
		</main>
	)
}
