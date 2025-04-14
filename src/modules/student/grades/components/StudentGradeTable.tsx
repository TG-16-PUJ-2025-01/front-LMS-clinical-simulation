import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	flexRender,
	ColumnDef,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import { useParams } from "react-router-dom"
import { StudentGradeDto } from "@/modules/shared/students-grades/services/gradeService"
import { getStudentGradeByClassId } from "../services/gradesService"

export default function StudentGradeTable() {
	const { classId } = useParams()
	const [studentGrades, setStudentGrades] = useState<StudentGradeDto | null>(null)

	useEffect(() => {
		async function fetchStudentGrades() {
			try {
				const res = await getStudentGradeByClassId(Number(classId))
				setStudentGrades(res.data)
				console.log(res.data)
			} catch (err) {
				console.error("Error al obtener las calificaciones del estudiante", err)
			}
		}
		fetchStudentGrades()
	}, [classId])

	const practiceNames = useMemo(() => {
		if (!studentGrades) return []
		return Object.keys(studentGrades.practiceGrades)
	}, [studentGrades])

	const columns: ColumnDef<any>[] = useMemo(() => {
		const staticCols: ColumnDef<any>[] = [
			{
				accessorKey: "studentName",
				header: "Estudiante",
				cell: () => <div className="text-center">{studentGrades?.studentName}</div>,
			},
		]

		const dynamicCols: ColumnDef<any>[] = practiceNames.map((practice) => ({
			accessorKey: `practiceGrades.${practice}`,
			id: practice,
			header: () => <div className="flex w-full justify-center text-center">{practice}</div>,
			cell: () => {
				const value = studentGrades?.practiceGrades[practice]
				return <div className="text-center">{value ?? "-"}</div>
			},
		}))

		const finalCol: ColumnDef<any> = {
			accessorKey: "finalGrade",
			header: "Nota Final",
			cell: () => <div className="text-center">{studentGrades?.finalGrade?.toFixed(2) ?? "-"}</div>,
		}

		return [...staticCols, ...dynamicCols, finalCol]
	}, [practiceNames, studentGrades])

	const table = useReactTable({
		data: studentGrades ? [studentGrades] : [],
		columns,
		state: {
			sorting: [],
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	})

	if (practiceNames.length === 0) {
		return (
			<p className="py-10 text-center text-gray-500">No existen practicas para ser evaluadas</p>
		)
	}

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-center">
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="text-center">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
