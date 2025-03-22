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
	const searchBy = ["Asignaturas", "Clases", "Profesores"]
	const [searchByKey, setSearchByKey] = useState<string>("")

	useEffect(() => {
		const fetchCoursesAndClasses = async () => {
			// Here we should fetch the courses and classes
			// using the filter and pagination values
			// and update the UI with the results
			const res = await getCoordinatorCourses(searchByKey,filter, true)

			setData(res.data)
			console.log("fetching classes" + `${res.data.forEach((element) => console.log(element))}`)
		}

		fetchCoursesAndClasses()
	}, [filter])

	return (
		<>
			<div className="flex items-center space-x-4 mt-2">
				<Combobox
					placeholderText="Buscar por..."
					options={searchBy.map((key) => ({
						key: Number(key),
						value: key,
					}))}
					itemName="por"
					onChange={(selected) => setSearchByKey(selected.value.toString())}
				/>
				<div className="relative w-1/2 max-w-sm">
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar..."
						value={filter}
						onChange={(event) => {
							setFilter(event.target.value)
						}}
						className="w-full pl-8"
					/>
				</div>
			</div>

			<div className="mt-4 w-full">
				{data.map((course) => (
					<div key={course.courseId} className="mt-6">
						<div className="mt-1 flex items-center space-x-4">
							<h1 className="text-xl font-bold">{course.name}</h1> {/* Nombre de la asignatura */}
							<Button>Recomendar rúbrica</Button>
						</div>

						<div className="rounded-md p-2" style={{ minHeight: "300px" }}>
							<div className="relative">
								{course.classes.length > 0 ? ( // Si hay clases, renderiza el carrusel
									<Carousel className="relative">
										<CarouselContent className="p-10">
											{course.classes.map((classItem) => (
												<CarouselItem key={classItem.classId}>
													<CardClass
														title={`(${classItem.javerianaId.toString()}) ${classItem.period}`} // Nombre de la clase
														professor={classItem.professors.map((prof) => prof.name).join(", ")} // Lista de profesores separados por comas
													/>
												</CarouselItem>
											))}
										</CarouselContent>
										<CarouselPrevious className="absolute top-1/2 left-0 -translate-y-1/2 transform" />
										<CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 transform" />
									</Carousel>
								) : (
									// Si no hay clases, muestra un mensaje alternativo
									<div className="flex h-full items-center justify-center">
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
