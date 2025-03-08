import Course from "./course"
import Criteria from "./criteria"
import User from "./user"

export default interface RubricTemplate {
    rubricTemplateId?: number
    title: string
    creator: User
    criteria: Criteria[]
    courses: Course[]
    creationDate: Date
    archived: boolean
}