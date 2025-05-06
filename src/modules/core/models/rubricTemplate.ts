import Course from "./course"
import Criteria from "./criteria"
import { RubricColumn } from "./rubricColumn"
import User from "./user"

export default interface RubricTemplate {
    rubricTemplateId?: number
    title: string
    creator: User
    criteria: Criteria[]
    columns: RubricColumn[]
    courses: Course[]
    creationDate: Date
    archived: boolean
}