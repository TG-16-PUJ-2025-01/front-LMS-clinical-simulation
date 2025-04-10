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
import { ArrowUpDown, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu"
import { Input } from "@/modules/core/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/core/components/ui/table"
import Course from "@/modules/core/models/course"
import EditCourseDialog from "./EditCourseDialog"
import DeleteCourseDialog from "./DeleteCourseDialog"
import { useEffect, useState } from "react"
import CreateCourseDialog from "./CreateCourseDialog"
import { getCourses } from "../services/courseService"

export function CoursesDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [openDialog, setEditDialog] = useState<"edit" | "delete" | "create" | null>(null)
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

	const [data, setData] = useState<Course[]>([])

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

		const fetchCourses = async () => {
			const res = await getCourses(
				pagination.pageIndex,
				pagination.pageSize,
				filter,
				sorting[0]?.id,
				!(sorting[0]?.desc ?? false)
			)
			setData(res.data)
			setPaginationInfo({
				total: res.metadata.total,
				totalPages: res.metadata.totalPages,
			})
		}

		fetchCourses()
	}, [pagination, filter, sorting, openDialog])

	const handleOpenDialog = (type: "create" | "edit" | "delete", Course?: Course) => {
		setEditDialog(type)
		setSelectedCourse(Course ?? null)
	}

	const handleCloseDialog = () => {
		setEditDialog(null)
		setSelectedCourse(null)
	}

	const columns: ColumnDef<Course>[] = [
		{
			accessorKey: "javerianaId",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID de la asignatura
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("javerianaId")}</div>
			},
		},
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Nombre
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
		},
		{
			id: "coordinator",
			accessorFn: ({ coordinator }) => `${coordinator.name} ${coordinator.lastName}`,
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Coordinador
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("coordinator")}</div>,
		},
		{
			id: "department",
			accessorFn: ({ department }) => `${department}`,
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Departamento
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("department")}</div>,
		},
		{
			id: "program",
			accessorFn: ({ program }) => `${program}`,
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Programa
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("program")}</div>,
		},
		{
			id: "semester",
			accessorFn: ({ semester }) => `${semester}`,
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Semestre
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("semester")}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const Course = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", Course)}>
								<Pencil /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", Course)}>
								<Trash2 /> Borrar
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
							placeholder="Buscar..."
							value={filter}
							onChange={(event) => {
								setFilter(event.target.value)
								setPagination({ ...pagination, pageIndex: 0 })
							}}
							className="w-full pl-8"
						/>
					</div>
					<Button onClick={() => handleOpenDialog("create")}>Nueva asignatura</Button>
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
										No existen resultados.
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
			<EditCourseDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				course={selectedCourse ?? undefined}
			/>
			<DeleteCourseDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				course={selectedCourse ?? undefined}
			/>
			<CreateCourseDialog open={openDialog === "create"} onClose={handleCloseDialog} />
		</>
	)
}
