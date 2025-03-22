import { Button } from "@/modules/core/components/ui/button"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/modules/core/components/ui/context-menu"
import {
	FormItem,
	FormControl,
	FormField,
	FormLabel,
	FormMessage,
} from "@/modules/core/components/ui/form"
import { Input } from "@/modules/core/components/ui/input"
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
  Table,
} from "@/modules/core/components/ui/table"
import { Textarea } from "@/modules/core/components/ui/textarea"
import Criteria from "@/modules/core/models/criteria"
import { RubricColumn } from "@/modules/core/models/rubricColumn"
import { useState } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"


interface BasicRubric {
	columns: RubricColumn[]
	criteria: Criteria[]
}

interface RubricFormValues extends FieldValues {
	title: string
	courses: [{ label: string; value: number }, ...{ label: string; value: number }[]]
	rubric: BasicRubric
}

interface Props {
	form: UseFormReturn<RubricFormValues, unknown>
	field: { value: RubricFormValues["rubric"] }
}

export function RubricFormItem({ form, field }: Props) {
	const [colId, setColId] = useState<number>(3)
	const [criteriaId, setCriteriaId] = useState<number>(3)
	const [numCols, setNumCols] = useState<number>(2)

	const deleteColumn = (id: number) => {
		const currentRubric = form.getValues("rubric")

		if (currentRubric.columns.length === 1) {
			return
		}

		let index = -1

		// Remove column
		const newColumns = currentRubric.columns.filter((col) => {
			if (col.rubricColumnId !== id) {
				index++
				return true
			}
		})

		// Update each criteria's scoring scale and descriptions
		const updatedCriteria: Criteria[] = currentRubric.criteria.map((criteria) => ({
			...criteria,
			scoringScaleDescription: criteria.scoringScaleDescription.filter((_, idx) => idx !== index),
		}))

		form.setValue(
			"rubric",
			{
				columns: newColumns,
				criteria: updatedCriteria,
			},
			{ shouldDirty: true }
		)

		setNumCols((prev) => prev - 1)
	}

	const deleteCriteria = (id: number) => {
		const currentRubric = form.getValues("rubric")

		if (currentRubric.criteria.length === 1) {
			return
		}

		// Remove criteria
		const newCriteria = currentRubric.criteria.filter((criteria) => criteria.criteriaId !== id)

		form.setValue(
			"rubric",
			{
				columns: currentRubric.columns,
				criteria: newCriteria,
			},
			{ shouldDirty: true }
		)
	}

	const addColumn = (id?: number, where: "left" | "right" = "left") => {
		const currentRubric = form.getValues("rubric")
  
    let index
    if (id) {
      index = currentRubric.columns.findIndex((col) => col.rubricColumnId === id)
      index = where === "left" ? index : index + 1
    } else {
      index = currentRubric.columns.length
    }

		const newColumns: RubricColumn[] = [
			...currentRubric.columns.slice(0, index),
			{
				rubricColumnId: colId,
				title: "Columna " + colId,
				scoringScale: { lowerValue: 0, upperValue: 5 },
			},
			...currentRubric.columns.slice(index),
		]

		const updatedCriteria: Criteria[] = currentRubric.criteria.map((criteria) => ({
			...criteria,
			scoringScaleDescription: [
				...criteria.scoringScaleDescription.slice(0, index),
				"Descripción",
				...criteria.scoringScaleDescription.slice(index),
			],
		}))

		form.setValue(
			"rubric",
			{
				columns: newColumns,
				criteria: updatedCriteria,
			},
			{ shouldDirty: true }
		)

		setColId((prev) => prev + 1)
		setNumCols((prev) => prev + 1)
	}

	const addCriteria = (id?: number, where: "above" | "below" = "above") => {
		const currentRubric = form.getValues("rubric")

    let index
    if (id) {
      index = currentRubric.criteria.findIndex((criteria) => criteria.criteriaId === id)
      index = where === "above" ? index : index + 1
    } else {
      index = currentRubric.criteria.length
    }

		const newCriteria: Criteria = {
			criteriaId,
			name: String.fromCharCode(64 + criteriaId), // Generates next letter (A, B, C...)
			weight: 0,
			scoringScaleDescription: Array<string>(currentRubric.columns.length).fill("Descripción"),
		}

		const updatedCriteria: Criteria[] = [
			...currentRubric.criteria.slice(0, index),
			newCriteria,
			...currentRubric.criteria.slice(index),
		]

		form.setValue(
			"rubric",
			{
				columns: currentRubric.columns,
				criteria: updatedCriteria,
			},
			{ shouldDirty: true }
		)

		setCriteriaId((prev) => prev + 1)
	}

	return (
		<FormItem className="flex max-w-full flex-col gap-2">
			<FormControl>
				<section className="flex max-w-[92vw] flex-col gap-2 xl:max-w-[1152px]">
					<div className="flex h-full w-full gap-2">
						<article className="max-h-[60vh] flex-1 overflow-auto rounded-md border">
							<Table className="h-full w-full">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px] border py-1 align-top">Criterios</TableHead>
										<TableHead className="w-20 min-w-20 border py-1 align-top">Peso</TableHead>
										{field.value.columns.map((column, index) => (
											<TableHead
												key={column.rubricColumnId}
												className="text-accent-foreground border py-1"
											>
												<ContextMenu>
													<ContextMenuTrigger className="flex h-full w-full grow flex-col">
														<FormField
															control={form.control}
															name={`rubric.columns.${index}.title`}
															render={({ field }) => (
																<FormItem className="flex flex-col gap-2">
																	<FormControl>
																		<Textarea
																			className="h-full min-h-min min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																			style={{
																				maxWidth: `calc((100vw - 176px) / ${numCols})`,
																			}}
																			{...field}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<span className="text-blue-javeriana flex items-center gap-2 text-xs font-bold italic">
															<FormField
																control={form.control}
																name={`rubric.columns.${index}.scoringScale.lowerValue`}
																render={({ field }) => (
																	<FormItem className="flex items-baseline gap-2">
																		<FormLabel>Min</FormLabel>
																		<FormControl>
																			<Input
																				type="number"
																				min={0}
																				max={5}
																				className="field-sizing-content h-min w-fit px-2"
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
															-
															<FormField
																control={form.control}
																name={`rubric.columns.${index}.scoringScale.upperValue`}
																render={({ field }) => (
																	<FormItem className="flex items-baseline gap-2">
																		<FormLabel>Max</FormLabel>
																		<FormControl>
																			<Input
																				type="number"
																				min={0}
																				max={5}
																				className="field-sizing-content h-min w-fit px-2"
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
															puntos
														</span>
													</ContextMenuTrigger>
													<CustomContextMenuContent
														colActions={{
															id: column.rubricColumnId!,
															add: addColumn,
															delete: deleteColumn,
															deleteDisabled: field.value.columns.length === 1,
														}}
													/>
												</ContextMenu>
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{field.value.criteria.map((criteria, index) => (
										<TableRow key={criteria.criteriaId}>
											<TableCell className="border font-medium">
												<ContextMenu>
													<ContextMenuTrigger className="flex h-full w-full grow flex-col">
														<FormField
															control={form.control}
															name={`rubric.criteria.${index}.name`}
															render={({ field }) => (
																<FormItem className="flex flex-col gap-2">
																	<FormControl>
																		<Textarea
																			className="h-full min-h-min w-2 max-w-[100px] min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																			{...field}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</ContextMenuTrigger>
													<CustomContextMenuContent
														rowActions={{
															id: criteria.criteriaId!,
															add: addCriteria,
															delete: deleteCriteria,
															deleteDisabled: form.getValues("rubric").criteria.length === 1,
														}}
													/>
												</ContextMenu>
											</TableCell>
											<TableCell className="border font-medium">
												<ContextMenu>
													<ContextMenuTrigger className="flex h-full w-full grow">
														<FormField
															control={form.control}
															name={`rubric.criteria.${index}.weight`}
															render={({ field }) => (
																<FormItem className="inline-flex w-[calc(100%-1rem)] flex-col gap-2">
																	<FormControl>
																		<Input
																			type="number"
																			min={0}
																			max={100}
																			className="h-full min-h-min w-full max-w-[100px] resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																			{...field}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<span>%</span>
													</ContextMenuTrigger>
													<CustomContextMenuContent
														rowActions={{
															id: criteria.criteriaId!,
															add: addCriteria,
															delete: deleteCriteria,
															deleteDisabled: form.getValues("rubric").criteria.length === 1,
														}}
													/>
												</ContextMenu>
											</TableCell>
											{criteria.scoringScaleDescription.map((_, index2) => (
												<TableCell
													key={`${criteria.criteriaId}-${field.value.columns[index2].rubricColumnId}`}
													className="border p-0"
													style={{ width: `calc((100vw - 176px) / ${numCols})` }}
												>
													<ContextMenu>
														<ContextMenuTrigger className="flex h-full w-full grow p-2">
															<FormField
																control={form.control}
																name={`rubric.criteria.${index}.scoringScaleDescription.${index2}`}
																render={({ field }) => (
																	<FormItem className="flex w-full flex-col gap-2">
																		<FormControl>
																			<Textarea
																				className="h-full min-h-fit min-w-full resize-none rounded-none border-0 p-0 text-wrap shadow-none focus-visible:ring-0"
																				style={{
																					maxWidth: `calc((100vw - 176px) / ${numCols})`,
																				}}
																				{...field}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</ContextMenuTrigger>
														<CustomContextMenuContent
															colActions={{
																id: field.value.columns[index2].rubricColumnId!,
																add: addColumn,
																delete: deleteColumn,
																deleteDisabled: field.value.columns.length === 1,
															}}
															rowActions={{
																id: criteria.criteriaId!,
																add: addCriteria,
																delete: deleteCriteria,
																deleteDisabled: field.value.criteria.length === 1,
															}}
														/>
													</ContextMenu>
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</article>
						<div className="flex flex-col">
							<Button
								type="button"
								variant="ghost"
								className="h-full flex-grow rounded-md border px-1"
								onClick={() => addColumn()}
							>
								+
							</Button>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						className="flex h-5 w-[calc(100%-28px)] items-center justify-center rounded-md border"
						onClick={() => addCriteria()}
					>
						+
					</Button>
				</section>
			</FormControl>
			<FormMessage className="m-0 -mt-2" />
		</FormItem>
	)
}

interface CustomContextMenuContentProps {
	colActions?: {
		id: number
		add: (index: number, where: "left" | "right") => void
		delete: (index: number) => void
		deleteDisabled: boolean
	}
	rowActions?: {
		id: number
		add: (index: number, where: "above" | "below") => void
		delete: (index: number) => void
		deleteDisabled: boolean
	}
}

function CustomContextMenuContent({ colActions, rowActions }: CustomContextMenuContentProps) {
	return (
		<ContextMenuContent className="w-64">
			<ContextMenuSub>
				<ContextMenuSubTrigger inset>Insertar</ContextMenuSubTrigger>
				<ContextMenuSubContent className="w-48">
					{rowActions && (
						<>
							<ContextMenuItem onClick={() => rowActions.add(rowActions.id, "above")}>
								Fila encima
							</ContextMenuItem>
							<ContextMenuItem onClick={() => rowActions.add(rowActions.id, "below")}>
								Fila debajo
							</ContextMenuItem>
						</>
					)}

					{rowActions && colActions && <ContextMenuSeparator />}
					{colActions && (
						<>
							<ContextMenuItem onClick={() => colActions.add(colActions.id, "left")}>
								Columna a la izquierda
							</ContextMenuItem>
							<ContextMenuItem onClick={() => colActions.add(colActions.id, "right")}>
								Columna a la derecha
							</ContextMenuItem>
						</>
					)}
				</ContextMenuSubContent>
			</ContextMenuSub>
			<ContextMenuSub>
				<ContextMenuSubTrigger inset>Eliminar</ContextMenuSubTrigger>
				<ContextMenuSubContent className="w-48">
					{rowActions && (
						<ContextMenuItem
							onClick={() => rowActions.delete(rowActions.id)}
							disabled={rowActions.deleteDisabled}
						>
							Fila
						</ContextMenuItem>
					)}
					{colActions && (
						<ContextMenuItem
							onClick={() => colActions.delete(colActions.id)}
							disabled={colActions.deleteDisabled}
						>
							Columna
						</ContextMenuItem>
					)}
				</ContextMenuSubContent>
			</ContextMenuSub>
		</ContextMenuContent>
	)
}
