export default interface PracticeDto {
    name: string
    description: string
    type: string
    gradeable: boolean
    simulationDuration: number
    numberOfGroups?: number | null
    maxStudentsGroup?: number | null
}