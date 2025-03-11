import { ColumnDef, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSimulationsByPracticeId } from "../services/bookingService"
import Simulation from "@/modules/core/models/simulation"
import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/table"
import { Search } from "lucide-react"

export function SimulationDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const navigate = useNavigate()
	const { id } = useParams()

	const [openDialog, setOpenDialog] = useState<"edit" | "delete" | "create" | null>(null)
    const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null)

	const [data, setData] = useState<Simulation[]>([])

	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	})

	const [paginationInfo, setPaginationInfo] = useState({
		total: 0, //total number of records
		totalPages: 0, //total number of pages
	})

	useEffect(() => {
		if (openDialog) return

		const fetchClasses = async () => {
			const res = await getSimulationsByPracticeId(
                Number(id),
				pagination.pageIndex,
				pagination.pageSize,
				)
			setData(res.data)
			setPaginationInfo({
				total: res.metadata.total,
				totalPages: res.metadata.totalPages,
			})
		}

		fetchClasses()
	}, [pagination, filter, sorting, openDialog])

    const columns: ColumnDef<Simulation>[] = [
        {
            accessorKey: "startDateTime",
            header: "Start Date Time",
            cell: ({ row }) => <div>{row.getValue("startDateTime")}</div>,
        },
        {
            accessorKey: "endDateTime",
            header: "End Date Time",
            cell: ({ row }) => <div>{row.getValue("endDateTime")}</div>,
        },
        {
            accessorKey: "grade",
            header: "Grade",
            cell: ({ row }) => <div>{row.getValue("grade")}</div>,
        },
        {
            accessorKey: "gradeStatus",
            header: "Grade Status",
            cell: ({ row }) => <div>{row.getValue("gradeStatus")}</div>,
        },
        {
            accessorKey: "gradeDateTime",
            header: "Grade Date Time",
            cell: ({ row }) => <div>{row.getValue("gradeDateTime")}</div>,
        },
    ]

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		onPaginationChange: setPagination,
		rowCount: paginationInfo.total,
		pageCount: paginationInfo.totalPages,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			pagination,
		},
	})

	return (
		<>
			<div className="w-full">
				<div className="flex items-center justify-between">
					<div className="relative w-1/2 max-w-sm">
						<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
						<Input
							placeholder="Buscar..."
							value={filter}
							onChange={(event) => {
								setFilter(event.target.value)
								setPagination({ ...pagination, pageIndex: 0 })
							}}
							className="w-full pl-8"
						/>
					</div>
				</div>
				<div className="rounded-md border mt-4">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										Sin resultados.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 pt-4">
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Anterior
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Siguiente
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
