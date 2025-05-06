// services/gradeService.ts
import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"

export type StudentGradeDto = {
  studentName: string
  finalGrade: number
  practiceGrades: Record<string, number | null>
}

export type PracticePercentageDto = {
  practiceId: number
  percentage: number
}

export type PracticesPercentagesDto = {
  practicesPercentages: PracticePercentageDto[]
}

export async function getGradesByClassId(classId: number): Promise<ApiResponse<StudentGradeDto[]>> {
  const { data } = await axios.get(`${API_URL}/grade/class/${classId}`)
  return data
}

export async function updatePracticePercentages(
  payload: {
    practicesPercentages: Array<{
      practiceId: number,
      percentage: number
    }>
  }
): Promise<ApiResponse<void>> {
  const { data } = await axios.put(`${API_URL}/grade/percentages`, payload)
  return data
}

export async function getClassPractices(classId: number): Promise<ApiResponse<Array<{
  id: number
  name: string
  percentage: number | null
}>>> {
  const { data } = await axios.get(`${API_URL}/practice/class/${classId}`)
  return data
}