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
import { getPracticesPercentageByClassId, getStudentGradeByClassId } from "../services/gradesService"
import { PracticesPercentageDTO } from "../dtos/praticesPercentageDto"

export default function StudentGradeTable() {
    const { classId } = useParams()
    const [studentGrades, setStudentGrades] = useState<StudentGradeDto | null>(null)
    const [practicesPercentage, setPracticesPercentage] = useState<PracticesPercentageDTO[] | null>(null)

    const fetchStudentGrades = async () => {
        try {
            const res = await getStudentGradeByClassId(Number(classId))
            setStudentGrades(res.data)
        } catch (err) {
            console.error("Error al obtener las calificaciones del estudiante", err)
        }
    }

    const fetchPracticesPercentage = async () => {
        try {
            const res = await getPracticesPercentageByClassId(Number(classId))
            setPracticesPercentage(res.data)
        } catch (err) {
            console.error("Error al obtener los porcentajes de las prácticas", err)
        }
    }

    useEffect(() => {
        fetchStudentGrades()
        fetchPracticesPercentage()
    }, [classId])

    const practiceNames = useMemo(() => {
        if (!studentGrades) return []
        return Object.keys(studentGrades.practiceGrades)
    }, [studentGrades])

    const rows = useMemo(() => {
        if (!studentGrades || !practicesPercentage) return []

        return practiceNames.map((practice, index) => {
            const percentage = practicesPercentage[index]?.percentage ?? "-"
            return {
                label: practice,
                percentage,
                value: studentGrades.practiceGrades[practice] ?? "-",
            }
        }).concat({
            label: "Nota Final",
            percentage: 100,
            value: studentGrades.finalGrade?.toFixed(2) ?? "-",
        })
    }, [studentGrades, practicesPercentage, practiceNames])

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
                            <TableHead className="text-center">Porcentaje (%)</TableHead>
                            <TableHead className="text-center">Calificación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{row.label}</TableCell>
                                <TableCell className="text-center">{row.percentage}</TableCell>
                                <TableCell className="text-center">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}