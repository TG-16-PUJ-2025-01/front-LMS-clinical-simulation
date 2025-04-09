export default interface SimulationAvailabilityDTO {
    simulationId: number
    groupNumber: number
    startDateTime: Date
    endDateTime: Date
    available: boolean
}