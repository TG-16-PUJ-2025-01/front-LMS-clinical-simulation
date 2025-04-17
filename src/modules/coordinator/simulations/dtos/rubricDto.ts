import EvaluatedCriteria from "@/modules/core/models/evaluatedCriteria"
import RubricTemplate from "@/modules/core/models/rubricTemplate"

export default interface RubricDto {
  evaluatedCriterias?: Partial<EvaluatedCriteria | undefined>[]
  rubricTemplate?: RubricTemplate
  total?: Partial<EvaluatedCriteria>
}
