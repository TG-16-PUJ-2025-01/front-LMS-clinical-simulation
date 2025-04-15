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
import { useNavigate, useParams } from "react-router-dom"
import { getSimulationsByPracticeId } from "../../../coordinator/bookings/services/bookingService"
import Simulation from "@/modules/core/models/simulation"
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
import { ArrowUpDown, Calendar, MoreHorizontal, Pencil, Search, Users } from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu"
import { gradeStatusLabels } from "@/modules/core/models/gradeStatus"
import { format } from "date-fns"
import AssignRubricDialog from "../../../coordinator/bookings/components/AssignRubricDialog"
import Practice from "@/modules/core/models/practice"
import CreateSimulationsDialog from "../../../coordinator/bookings/components/CreateSimulationsDialog"
import EditSimulationsDialog from "../../../coordinator/bookings/components/EditSimulationsDialog"
import ViewMembersDialog from "../../../coordinator/bookings/components/ViewMembersDialog"

interface Props {
	practice: Practice
}

export function SimulationDataTable({ practice }: Props) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const { practiceId } = useParams()
	const navigate = useNavigate()

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isAssignRubricOpen, setIsAssignRubricOpen] = useState(false)
	const [isViewMembersOpen, setIsViewMembersOpen] = useState(false)
	const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null)

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
			const res = await getSimulationsByPracticeId(
				Number(practiceId),
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
		}

		fetchSimulations()
	}, [pagination, filter, sorting, practiceId])

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
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("groupNumber")}</div>
			},
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
				return <div className="text-center capitalize">{format(date, "dd/MM/yyyy HH:mm")}</div>
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
				return <div className="text-center capitalize">{format(date, "dd/MM/yyyy HH:mm")}</div>
			},
		},
		{
			accessorKey: "gradeStatus",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Estado de Calificación
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				const gradeStatus = row.getValue("gradeStatus") as keyof typeof gradeStatusLabels
				return <div className="text-center capitalize">{gradeStatusLabels[gradeStatus]}</div>
			},
		},
		{
			accessorKey: "gradeDateTime",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Hora de Calificación
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				const date = row.getValue("gradeDateTime")
				return (
					<div className="text-center capitalize">
						{date ? format(new Date(row.getValue("gradeDateTime")), "dd/MM/yyyy HH:mm") : ""}
					</div>
				)
			},
		},
		{
			accessorKey: "grade",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="flex w-full items-center justify-center"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Calificación
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center capitalize">{row.getValue("grade")}</div>
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const simulation = row.original
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
							<DropdownMenuItem
								onClick={() => navigate(`/coordinador/simulacion/${simulation.simulationId}`)}
							>
								<Pencil /> Calificar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSelectedSimulation(simulation)
									setIsEditDialogOpen(true)
								}}
							>
								<Calendar /> Editar Reserva
							</DropdownMenuItem>
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
		<>
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
					<div className="flex items-center space-x-2">
						<Button onClick={() => setIsAssignRubricOpen(true)}>Asignar rúbrica</Button>
						<Button onClick={() => setIsDialogOpen(true)}>Modificar Reservas</Button>
					</div>
				</div>
				<div className="mt-4 rounded-md border">
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
			<CreateSimulationsDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
			<EditSimulationsDialog
				open={isEditDialogOpen}
				onClose={() => setIsEditDialogOpen(false)}
				simulation={selectedSimulation}
			/>

			<ViewMembersDialog
				open={isViewMembersOpen}
				onClose={() => setIsViewMembersOpen(false)}
				simulationId={selectedSimulation?.simulationId ?? 0}
			/>
			<AssignRubricDialog
				open={isAssignRubricOpen}
				onClose={() => setIsAssignRubricOpen(false)}
				courseId={practice.classModel.course.courseId ?? 0}
				selectedRubricTemplate={practice.rubricTemplate ?? undefined}
			/>
		</>
	)
}
