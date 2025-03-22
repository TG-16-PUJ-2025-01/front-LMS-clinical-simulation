import axios from "axios";
import { API_URL } from "@/modules/core/config/env";
import CourseDto from "@/modules/coordinator/courses/dtos/courseDto";
import ApiResponse from "@/modules/core/models/apiResponse";

export async function getCoordinatorCourses(
    filter: string,
    asc: boolean
  ): Promise<ApiResponse<CourseDto[]>> {
      const { data } = await axios.get(`${API_URL}/course/all/coordinator`, {
          params: {
              filter,
              asc,
          },
      })
  
    console.log(data)
      return {
          ...data,
          data: data.data,
      }
  }
  