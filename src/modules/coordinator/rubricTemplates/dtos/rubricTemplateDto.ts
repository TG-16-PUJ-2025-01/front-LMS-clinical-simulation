import Criteria from "@/modules/core/models/criteria"
import { RubricColumn } from "@/modules/core/models/rubricColumn"

export default interface RubricTemplateDto {
	courses: number[]
	title: string
	criteria: Criteria[]
  columns: RubricColumn[]
  archived: boolean
	practiceId?: number
}
