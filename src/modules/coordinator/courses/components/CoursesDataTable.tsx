import { Search } from "lucide-react"
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
import { Button } from "@/modules/core/components/ui/button"

export function CoursesDataTable() {
	const navigate = useNavigate()
	const [yearOptions, setYearOptions] = useState<{ key: number; value: string }[]>([])
	const periodOptions = ["10", "20", "30"].map((period) => ({
		key: Number(period),
		value: period,
	}))
	const searchBy = ["Asignaturas", "Clases", "Profesores"].map((by, index) => ({
		key: index,
		value: by,
	}))

	const [data, setData] = useState<CourseDTO[]>([])
	const [searchByKey, setSearchByKey] = useState<string>("")
	const [selectedYear, setSelectedYear] = useState<string>("")
	const [selectedPeriod, setSelectedPeriod] = useState<string>("")
	const [filter, setFilter] = useState<string>("")

	const resetFilters = () => {
		setSelectedYear("")
		setSelectedPeriod("")
		setFilter("")
		setSearchByKey("")
	}

	useEffect(() => {
		const fetchCoursesAndClasses = async () => {
			let searchPeriod = ""
			if (selectedYear != "" && selectedPeriod === "") {
				searchPeriod = selectedYear
			} else if (selectedYear === "" && selectedPeriod != "") {
				searchPeriod = "-" + selectedPeriod
			} else if (selectedYear != "" && selectedPeriod != "") {
				searchPeriod = selectedYear + "-" + selectedPeriod
			} else {
				searchPeriod = ""
			}

			const res = await getCoordinatorCourses(searchByKey, filter, searchPeriod, true)

			if (selectedYear != "" || selectedPeriod != "" || searchByKey != "") {
				res.data = res.data.filter((element) => element.classes.length > 0)
			}

			setData(res.data)

			console.log("Data fetched:", res.data)
		}

		fetchCoursesAndClasses()
	}, [filter, searchByKey, selectedYear, selectedPeriod])

	useEffect(() => {
		const fetchYearOptions = async () => {
			try {
				const res = await getCoordinatorCourses("", "", "", false)
				const years = res.data.flatMap((course: CourseDTO) =>
					course.classes.map((classItem) => parseInt(classItem.period.split("-")[0]))
				)
				const oldestYear = Math.min(...years)
				const newestYear = Math.max(...years)
				const generatedYearOptions = Array.from(
					{ length: newestYear - oldestYear + 1 },
					(_, i) => ({
						key: newestYear - i,
						value: (newestYear - i).toString(),
					})
				)
				setYearOptions(generatedYearOptions)

				console.log("Year options fetched:", generatedYearOptions)
			} catch (error) {
				console.error("Error fetching classes:", error)
			}
		}

		fetchYearOptions()
	}, [])

	return (
		<>
			<div className="mb-4 flex items-center justify-between gap-4">
				<div className="flex w-1/2 items-center gap-4">
					<Combobox
						placeholderText="Buscar por..."
						options={searchBy}
						itemName="por"
						selectedValue={searchBy ? searchByKey : ""}
						onChange={(selected) => {
							if (selected?.value === searchByKey) {
								setSearchByKey("")
							} else {
								setSearchByKey(selected?.value || "")
							}
						}}
					/>
					<div className="relative w-full">
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
				<div className="flex items-center gap-4">
					<Combobox
						placeholderText="Año"
						options={yearOptions}
						selectedValue={selectedYear ? selectedYear.toString() : ""}
						itemName="año"
						onChange={(selected) => {
							setSelectedYear(selected?.value.toString() ?? "")
						}}
					/>
					<span className="text-xl font-bold">-</span>
					<Combobox
						placeholderText="Periodo"
						options={periodOptions}
						selectedValue={selectedPeriod ? selectedPeriod.toString() : ""}
						itemName="periodo"
						onChange={(selected) => {
							setSelectedPeriod(selected?.value.toString() ?? "")
						}}
					/>
					<Button variant="default" onClick={resetFilters}>
						Reiniciar Filtros
					</Button>
				</div>

				<div className="flex w-1/2 items-center justify-end space-x-4">
					<Combobox
						placeholderText="Año"
						options={yearOptions}
						selectedValue={selectedYear ? selectedYear.toString() : ""}
						itemName="año"
						onChange={(selected) => {
							setSelectedYear(selected?.value.toString() ?? "")
						}}
					/>

					<span className="text-xl font-bold">-</span>

					<Combobox
						placeholderText="Periodo"
						options={periodOptions}
						selectedValue={selectedPeriod ? selectedPeriod.toString() : ""}
						itemName="periodo"
						onChange={(selected) => {
							setSelectedPeriod(selected?.value.toString() ?? "")
						}}
					/>
				</div>
			</div>

			<div className="mt-4 flex min-h-[60vh] w-full flex-col gap-4">
				{data.length === 0 && (
					<div className="flex h-full items-center justify-center">
						<p className="text-center text-gray-500">No hay resultados</p>
					</div>
				)}
				{data.map((course) => (
					<div key={course.courseId}>
						<div className="flex items-center space-x-4">
							<h1 className="text-lg font-bold">{course.name}</h1>{" "}
						</div>

						<div className="rounded-md p-2">
							<div className="relative">
								{course.classes.length > 0 ? (
									<Carousel className="relative">
										<CarouselContent className="px-12 py-4">
											{course.classes.map((classItem) => (
												<CarouselItem key={classItem.classId}>
													<CardClass
														title={`(${classItem.javerianaId.toString()}) ${classItem.period}`}
														professor={classItem.professors.map((prof) => prof.name).join(", ")}
														onClick={() =>
															navigate(`/coordinador/clases/${classItem.classId}/practicas`)
														}
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
