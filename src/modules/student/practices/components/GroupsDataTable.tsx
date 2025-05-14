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
import {
	ArrowUpDown,
	Search,
	Check,
	TriangleAlert,
	MoreHorizontal,
	Users,
	LogOut,
} from "lucide-react"
import { format } from "date-fns"
import {
	getEnroledSimulationId,
	getSimulationsAvailableByPracticeId,
} from "../services/practicesService"
import SimulationAvailabilityDTO from "../dtos/simulationAvailabilityDto"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu"
import ViewMembersDialog from "@/modules/coordinator/bookings/components/ViewMembersDialog"

interface GroupsDataTableProps {
	practiceId: number
	onEnroll: (simulationId: number) => void
	onLeave: (simulationId: number) => void
	maxNumStudentsPerGroup: number
}

export default function GroupsDataTable({
	practiceId,
	onEnroll,
	onLeave,
	maxNumStudentsPerGroup,
}: GroupsDataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [enrolledSimulationId, setEnrolledSimulationId] = useState<number | null>(null)
	const [triggerFetchEnrolled, setTriggerFetchEnrolled] = useState(false)

	const [isViewMembersOpen, setIsViewMembersOpen] = useState(false)
	const [selectedSimulation, setSelectedSimulation] = useState<SimulationAvailabilityDTO | null>(
		null
	)

	const [data, setData] = useState<SimulationAvailabilityDTO[]>([])

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const [paginationInfo, setPaginationInfo] = useState({
		total: 0,
		totalPages: 0,
	})

	useEffect(() => {
		const fetchEnrolledSimulation = async () => {
			try {
				const res = await getEnroledSimulationId(practiceId)
				setEnrolledSimulationId(res.data)
			} catch (error) {
				console.error("Error fetching enrolled simulation ID:", error)
			}
		}

		fetchEnrolledSimulation()
	}, [triggerFetchEnrolled])

	useEffect(() => {
		const fetchSimulations = async () => {
			try {
				const res = await getSimulationsAvailableByPracticeId(
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

	const columns: ColumnDef<SimulationAvailabilityDTO>[] = [
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
			cell: ({ row }) => {
				const simulation = row.original
				const simulationId = simulation.simulationId
				const isEnrolled = enrolledSimulationId === simulationId
				const isAvailable = simulation.available

				return (
					<Button
						disabled={isEnrolled || !isAvailable}
						variant={!isAvailable ? "outline" : "default"}
						onClick={async () => {
							await onEnroll(simulationId)
							setTriggerFetchEnrolled((prev) => !prev)
						}}
						className="flex items-center justify-center"
					>
						{isEnrolled ? (
							<>
								<Check />
								Inscrito
							</>
						) : isAvailable ? (
							"Inscribirse"
						) : (
							<>
								<TriangleAlert />
								No Disponible
							</>
						)}
					</Button>
				)
			},
		},
		{
			id: "viewMembers",
			enableHiding: false,
			cell: ({ row }) => {
				const simulation = row.original
				const simulationId = simulation.simulationId
				const isEnrolled = enrolledSimulationId === simulationId
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									setSelectedSimulation(simulation)
									setIsViewMembersOpen(true)
								}}
							>
								<Users /> Ver Miembros
							</DropdownMenuItem>
							{isEnrolled && (
								<DropdownMenuItem
									onClick={async () => {
										onLeave(simulationId)
										setTriggerFetchEnrolled((prev) => !prev)
									}}
								>
									<LogOut /> Salir de Grupo
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
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
				<div className="relative w-1/2 max-w-sm">
					<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
					<Input
						placeholder="Buscar por número de grupo..."
						value={filter}
						onChange={(event) => {
							setFilter(event.target.value)
							setPagination({ ...pagination, pageIndex: 0 })
						}}
						className="w-full pl-8"
					/>
				</div>
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
			<ViewMembersDialog
				open={isViewMembersOpen}
				onClose={() => setIsViewMembersOpen(false)}
				simulationId={selectedSimulation?.simulationId ?? 0}
				maxStudents={maxNumStudentsPerGroup}
			/>
		</div>
	)
}
