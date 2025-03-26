import { useEffect, useState } from "react"
import { CardClass } from "./CardClass"
import { getMenuInfo } from "../services/MainMenuService"
import Class from "@/modules/core/models/class"

type MainMenuDataTableProps = {
	selectedYear: number | null
	selectedPeriod: number | null
}

export function MainMenuDataTable({ selectedYear, selectedPeriod }: MainMenuDataTableProps) {
	const [data, setData] = useState<Class[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				setIsLoading(true)
				const res = await getMenuInfo(selectedYear ?? undefined, selectedPeriod ?? undefined)
				setData(res.data)
			} catch (error) {
				console.error("Error fetching classes:", error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchClasses()
	}, [selectedYear, selectedPeriod])

	return (
		<>
			<div className="flex justify-center">
				{isLoading ? (
					<p>Cargando clases...</p>
				) : data.length === 0 ? (
					<p className="text-gray-500">No se encontraron clases</p>
				) : (
					<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
						{data.map((classItem) => (
							<CardClass key={classItem.classId} classData={classItem} onClick={() => {}} />
						))}
					</div>
				)}
			</div>
		</>
	)
}
