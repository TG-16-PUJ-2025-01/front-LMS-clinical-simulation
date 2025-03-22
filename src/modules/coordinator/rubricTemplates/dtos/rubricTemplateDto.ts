import Criteria from "@/modules/core/models/criteria"
import { RubricColumns } from "@/modules/core/models/rubricColumns"

export default interface RubricTemplateDto {
	courses: number[]
	title: string
	criteria: Criteria[]
  columns: RubricColumns[]
  archived: boolean
	practiceId?: number
}
