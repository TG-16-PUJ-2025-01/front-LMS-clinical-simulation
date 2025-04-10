import EvaluatedCriteria from "./evaluatedCriteria";
import RubricTemplate from "./rubricTemplate";

export default interface Rubric {
  evaluatedCriteria: EvaluatedCriteria[]
  rubricTemplate: RubricTemplate
}