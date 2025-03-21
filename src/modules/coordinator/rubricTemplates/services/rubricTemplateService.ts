import { API_URL } from "@/modules/core/config/env";
import axios from "axios";

export function createRubricTemplate(data: any) {
  return axios.post(`${API_URL}/rubric/template`, data);
}
