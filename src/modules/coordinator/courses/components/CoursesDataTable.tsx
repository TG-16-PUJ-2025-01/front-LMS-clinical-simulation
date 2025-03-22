import { ArrowUpDown, MoreHorizontal, Pencil, Search, Trash2, User } from "lucide-react"
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

export function CoursesDataTable() {
	const [filter, setFilter] = useState<string>("")
	const [data, setData] = useState<CourseDTO[]>([])

	useEffect(() => {
		const fetchCoursesAndClasses = async () => {
			// Here we should fetch the courses and classes
			// using the filter and pagination values
			// and update the UI with the results
			const res = await getCoordinatorCourses(filter, true)

			setData(res.data)
			console.log("fetching classes" + `${res.data.forEach((element) => console.log(element))}`)
		}

		fetchCoursesAndClasses()
	}, [filter])

	return (
		<>
			<div className="flex items-center justify-between">
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

						<div className="rounded-md p-2">
							<div className="relative">
								<Carousel className="relative">
									<CarouselContent className="p-10">
										{course.classes.map((classItem) => (
											<CarouselItem key={classItem.classId}>
												<CardClass
													title={`${classItem.javerianaId.toString()} - ${classItem.period}`} // Nombre de la clase
													professor={classItem.professors.map((prof) => prof.name).join(", ")} // Lista de profesores separados por comas
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious className="absolute top-1/2 left-0 -translate-y-1/2 transform" />
									<CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 transform" />
								</Carousel>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
