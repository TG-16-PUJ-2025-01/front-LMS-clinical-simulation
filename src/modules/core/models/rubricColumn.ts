export interface RubricColumn {
	rubricColumnId?: number
	title: string
	scoringScale: {
		lowerValue: number
		upperValue: number
	}
}
