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

    const rows = useMemo(() => {
        if (!studentGrades) return []

        return [
            ...practiceNames.map((practice) => ({
                label: practice,
                value: studentGrades.practiceGrades[practice] ?? "-",
            })),
            {
                label: "Nota Final",
                value: studentGrades.finalGrade?.toFixed(2) ?? "-",
            },
        ]
    }, [studentGrades, practiceNames])

    if (!studentGrades) {
        return <div className="py-10 text-center">No se encontraron datos del estudiante.</div>
    }

    if (practiceNames.length === 0) {
        return <div className="py-10 text-center">No Existen Practicas Para Ser Evaluadas</div>
    }

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Práctica</TableHead>
                            <TableHead className="text-center">Calificación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{row.label}</TableCell>
                                <TableCell className="text-center">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}