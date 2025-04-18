import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"
import { StudentGradeDto } from "@/modules/shared/students-grades/services/gradeService"
import axios from "axios"
import { PracticesPercentageDTO } from "../dtos/praticesPercentageDto"

export async function getStudentGradeByClassId(
    classId: number
): Promise<ApiResponse<StudentGradeDto>> {
    const { data } = await axios.get(`${API_URL}/grade/student/${classId}`)
    return data
}

export async function getPracticesPercentageByClassId(
    classId: number
): Promise<ApiResponse<PracticesPercentageDTO[]>> {
    const { data } = await axios.get(
        `${API_URL}/grade/class/${classId}/percentages`
    )
    return data
}