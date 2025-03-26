import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CardClass } from "./CardClass"
import { getMenuInfo } from "../services/MainMenuService"
import Class from "@/modules/core/models/class"

export function MainMenuDataTable() {
	const [data, setData] = useState<Class[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const res = await getMenuInfo()
				setData(res.data)
                console.log(res.data);
			} catch (error) {
				console.error("Error fetching classes:", error)
			}
		}

		fetchClasses()
	}, [])

	const handleClassNavigation = (classItem: Class) => {
		navigate(`/teacher/class/${classItem.classId}`)
	}

	return (
		<>
			<div className="flex justify-center">
				<div className="grid grid-cols-1 gap-18 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{data.map((classItem) => (
						<CardClass
							key={classItem.classId}
							classData={classItem}
							onClick={() => {}}
						/>
					))}
				</div>
			</div>
		</>
	)
}