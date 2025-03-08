import Criteria from "@/modules/core/models/criteria"

export default interface RubricTemplateDto {
    //si se crea una rubrica para una practica en especifico
    coursesIds: number[]|null
    title: string
    criterias: Criteria[]
    creationDate: Date
    creatorId: number
    //si se crea una rubrica para un curso en especifico
    practiceId: number | null
}