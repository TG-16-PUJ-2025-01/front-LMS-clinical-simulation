import EvaluatedCriteria from "./evaluatedCriteria";
import RubricTemplate from "./rubricTemplate";

export default interface Rubric {
  rubricId?: number
  evaluatedCriterias: EvaluatedCriteria[]
  rubricTemplate: RubricTemplate
  total: EvaluatedCriteria
}
