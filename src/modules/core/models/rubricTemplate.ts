import Course from "./course"
import Criteria from "./criteria"
import { RubricColumns } from "./rubricColumns"
import User from "./user"

export default interface RubricTemplate {
    rubricTemplateId?: number
    title: string
    creator: User
    criteria: Criteria[]
    columns: RubricColumns[]
    courses: Course[]
    creationDate: Date
    archived: boolean
}