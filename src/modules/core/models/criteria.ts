export default interface Criteria {
    name: string
    description: string
    points: number
    scoringScale: [number, number][]
    scoringScaleDescription: string[]
    score: number | null
}