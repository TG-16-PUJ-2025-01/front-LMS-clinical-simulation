import EvaluatedCriteria from "./evaluatedCriteria";
import RubricTemplate from "./rubricTemplate";

export default interface Rubric {
  evaluatedCriterias: EvaluatedCriteria[]
  rubricTemplate: RubricTemplate
  total: EvaluatedCriteria
}