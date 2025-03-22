import { z } from "zod"
import { RubricFormValues } from "../components/RubricFormItem"

export function rubricValidation({ rubric }: RubricFormValues, ctx: z.RefinementCtx) {
  const totalWeight = rubric.criteria.reduce((sum, criteria) => sum + criteria.weight, 0)
  if (totalWeight !== 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La suma de pesos de los criterios debe ser igual a 100%",
      path: ["rubric"],
    })
  }

  const numEmptyWeights = rubric.criteria.filter((criteria) => criteria.weight === 0).length

  if (numEmptyWeights > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Todos los criterios deben tener un peso positivo",
      path: ["rubric"],
    })
  }

  if (rubric.columns.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La rúbrica debe tener al menos una columna",
      path: ["rubric"],
    })
  }

  if (rubric.criteria.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La rúbrica debe tener al menos un criterio",
      path: ["rubric"],
    })
  }

  const hasInvalidScoringScale = rubric.columns.some(
    (column) => column.scoringScale.lowerValue > column.scoringScale.upperValue
  )
  if (hasInvalidScoringScale) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El puntaje mínimo no puede ser mayor al puntaje máximo",
      path: ["rubric"],
    })
  }

  const hasOverlappingScoringScale = rubric.columns.some((column, index) =>
    rubric.columns.some(
      (otherColumn, otherIndex) =>
        index !== otherIndex &&
        column.scoringScale.lowerValue < otherColumn.scoringScale.upperValue &&
        column.scoringScale.upperValue > otherColumn.scoringScale.lowerValue
    )
  )

  if (hasOverlappingScoringScale) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Los rangos de puntaje no pueden superponerse",
      path: ["rubric"],
    })
  }

  const hasEmptyScoringDescription = rubric.criteria.some((criteria) =>
    criteria.scoringScaleDescription.some((description) => description === "")
  )
  if (hasEmptyScoringDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Todas las celdas de la rúbrica deben tener descripción",
      path: ["rubric"],
    })
  }

  const hasEmptyCriteriaName = rubric.criteria.some((criteria) => criteria.name === "")

  if (hasEmptyCriteriaName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Todos los criterios deben tener nombre",
      path: ["rubric"],
    })
  }

  const hasEmptyColumnTitle = rubric.columns.some((column) => column.title === "")

  if (hasEmptyColumnTitle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Todas las columnas deben tener título",
      path: ["rubric"],
    })
  }
}