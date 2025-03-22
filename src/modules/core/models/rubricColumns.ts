export interface RubricColumns {
	rubricColumnId?: number
	title: string
	scoringScale: {
		lowerValue: number
		upperValue: number
	}
}
