// services/grades.ts
import axios from "axios"
import { API_URL } from "@/modules/core/config/env"
import ApiResponse from "@/modules/core/models/apiResponse"

export type StudentGradeDto = {
  studentName: string
  finalGrade: number
  practiceGrades: Record<string, number | null>
}

export async function getGradesByClassId(classId: number): Promise<ApiResponse<StudentGradeDto[]>> {
  const { data } = await axios.get(`${API_URL}/grade/class/${classId}`)
  return data
}
