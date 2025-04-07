import {
	ColumnDef,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import Simulation from "@/modules/core/models/simulation"
import { getSimulationsByPracticeId } from "@/modules/coordinator/bookings/services/bookingService"

interface GroupsDataTableProps {
	practiceId: number
	onEnroll: (simulationId: number) => void
}

export default function GroupsDataTable({ practiceId, onEnroll }: GroupsDataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [data, setData] = useState<Simulation[]>([])

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const [paginationInfo, setPaginationInfo] = useState({
		total: 0,
		totalPages: 0,
	})

	useEffect(() => {
		const fetchSimulations = async () => {
			try {
				console.log("Fetching simulations...")
				console.log("Practice ID:", practiceId)
				const res = await getSimulationsByPracticeId(
					practiceId,
					pagination.pageIndex,
					pagination.pageSize,
					filter,
					sorting[0]?.id || "simulationId",
					!(sorting[0]?.desc ?? false)
				)
				setData(res.data)
				setPaginationInfo({
					total: res.metadata.total,
					totalPages: res.metadata.totalPages,
				})
			} catch (error) {
				console.error("Error fetching simulations:", error)
			}
		}

		fetchSimulations()
	}, [pagination, filter, sorting])

	const columns: ColumnDef<Simulation>[] = [
		{
			accessorKey: "groupNumber",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Número de Grupo
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("groupNumber")}</div>,
		},
		{
			accessorKey: "startDateTime",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Hora de Inicio
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				const date = new Date(row.getValue("startDateTime"))
				return <div className="text-center">{format(date, "dd/MM/yyyy HH:mm")}</div>
			},
		},
		{
			accessorKey: "endDateTime",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Hora de Finalización
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				const date = new Date(row.getValue("endDateTime"))
				return <div className="text-center">{format(date, "dd/MM/yyyy HH:mm")}</div>
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => (
				<Button onClick={() => onEnroll(row.original.simulationId)}>Inscribirse</Button>
			),
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
		<div className="w-full">
			<div className="flex items-center justify-between">
				<Input
					placeholder="Buscar por número de grupo..."
					value={filter}
					onChange={(event) => {
						setFilter(event.target.value)
						setPagination({ ...pagination, pageIndex: 0 })
					}}
					className="w-full max-w-sm"
				/>
			</div>
			<div className="mt-4 max-h-[400px] overflow-auto rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									Sin resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between space-x-2 pt-4">
				<span className="text-sm text-gray-600">
					Página {paginationInfo.totalPages === 0 ? 0 : pagination.pageIndex + 1} de{" "}
					{paginationInfo.totalPages}
				</span>
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
	)
}
