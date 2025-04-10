import { Search } from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/modules/core/components/ui/carousel"
import { CardClass } from "./CardClass"
import { getCoordinatorCourses } from "../services/courseService"
import CourseDTO from "../dtos/courseDto"
import { Combobox } from "@/modules/core/components/Combobox/Combobox"

export function CoursesDataTable() {
	const [filter, setFilter] = useState<string>("")
	const [data, setData] = useState<CourseDTO[]>([])
	const [searchByKey, setSearchByKey] = useState<string>("")
	const [year, setYear] = useState<string>("")
	const [period, setPeriod] = useState<string>("")
	const navigate = useNavigate()

	const searchBy = ["Asignaturas", "Clases", "Profesores"]
	const periodList = ["1", "2", "3", ""]
	const currentYear = new Date().getFullYear()
	const yearList = Array.from({ length: 21 }, (_, i) => currentYear - i)

	useEffect(() => {
		const fetchCoursesAndClasses = async () => {
			// Here we should fetch the courses and classes
			// using the filter and pagination values
			// and update the UI with the results

			let searchPeriod = ""
			if (year != "" && period === "") {
				searchPeriod = year
			} else if (year === "" && period != "") {
				searchPeriod = "-" + period
			} else if (year != "" && period != "") {
				searchPeriod = year + "-" + period
			} else {
				searchPeriod = ""
			}

			const res = await getCoordinatorCourses(searchByKey, filter, searchPeriod, true)

			//revisar si se deberia incluir la lista de res.data. quitar del array la info de los courses con clases en 0
			if (year != "" || period != "" || searchByKey != "") {
				res.data = res.data.filter((element) => element.classes.length > 0)
			}

			setData(res.data)
		}

		fetchCoursesAndClasses()
	}, [filter, searchByKey, period, year])

	return (
		<>
			<div className="flex items-center space-x-4">
				<Combobox
					placeholderText="Año"
					options={yearList.map((key, index) => ({
						key: index,
						value: key.toString(),
					}))}
					itemName="por"
					onChange={(selected) => {
						if (selected?.value === year) {
							setYear("") // Deselecciona si se selecciona lo mismo dos veces
						} else {
							setYear(selected?.value.toString() ?? "") // Actualiza el valor
						}
					}}
				/>

				<Combobox
					placeholderText="Periodo"
					options={periodList.map((key, index) => ({
						key: index,
						value: key,
					}))}
					itemName="por"
					onChange={(selected) => {
						if (selected?.value === period) {
							setPeriod("") // Deselecciona si se selecciona lo mismo dos veces
						} else {
							setPeriod(selected?.value.toString() ?? "") // Actualiza el valor
						}
					}}
				/>

				<Combobox
					placeholderText="Buscar por..."
					options={searchBy.map((key, index) => ({
						key: index, // Unique numeric key
						value: key,
					}))}
					itemName="por"
					onChange={(selected) => {
						if (selected?.value === searchByKey) {
							setSearchByKey("") // Deselecciona si se selecciona lo mismo dos veces
						} else {
							setSearchByKey(selected?.value || "") // Actualiza el valor
						}
					}}
				/>

				<div className="relative w-1/2 max-w-sm">
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar..."
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
						className="w-full pl-8"
						disabled={searchByKey === ""}
					/>
				</div>
			</div>

			<div className="mt-8 w-full min-h-[600px] flex flex-col gap-4">
				{data.map((course) => (
					<div key={course.courseId}>
						<div className="flex items-center space-x-4">
							<h1 className="text-xl font-bold">{course.name}</h1> {/* Nombre de la asignatura */}
							<Button>Recomendar rúbrica</Button>
						</div>

						<div className="rounded-md p-2">
							<div className="relative">
								{course.classes.length > 0 ? ( // Si hay clases, renderiza el carrusel
									<Carousel className="relative">
										<CarouselContent className="px-12 py-4">
											{course.classes.map((classItem) => (
												<CarouselItem key={classItem.classId}>
													<CardClass
														title={`(${classItem.javerianaId.toString()}) ${classItem.period}`} // Nombre de la clase
														professor={classItem.professors.map((prof) => prof.name).join(", ")} // Lista de profesores separados por comas
														onClick={() =>
															navigate(`/coordinador/clases/${classItem.classId}/practicas`)
														} // Navega a la página de prácticas
													/>
												</CarouselItem>
											))}
										</CarouselContent>
										<CarouselPrevious className="absolute top-1/2 left-0 -translate-y-1/2 transform" />
										<CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 transform" />
									</Carousel>
								) : (
									<div className="flex h-32 items-center justify-center">
										<p className="text-center text-gray-500">No hay clases asignadas</p>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
