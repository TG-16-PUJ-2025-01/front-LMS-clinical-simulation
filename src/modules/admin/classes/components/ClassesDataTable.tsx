import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Search, Trash2, User } from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import Class from "@/modules/core/models/class"
import EditClassDialog from "./EditClassDialog"
import DeleteClassDialog from "./DeleteClassDialog"
import { useEffect, useState } from "react"
import CreateClassDialog from "./CreateClassDialog"
import { getClasses } from "../services/classService"
import { useNavigate } from "react-router-dom"

export function ClassesDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const navigate = useNavigate()

	const [openDialog, setOpenDialog] = useState<"edit" | "delete" | "create" | null>(null)
	const [selectedClass, setSelectedClass] = useState<Class | null>(null)

	const [data, setData] = useState<Class[]>([])

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
			const res = await getClasses(
				pagination.pageIndex,
				pagination.pageSize,
				filter,
				sorting[0]?.id,
				!(sorting[0]?.desc ?? false)
			)

			setData(res.data)
			console.log("fetching classes"+ `${res.data.forEach((element) => console.log(element))}`)
			setPaginationInfo({
				total: res.metadata.total,
				totalPages: res.metadata.totalPages,
			})
		}

		fetchClasses()
	}, [pagination, filter, sorting, openDialog])

	const handleOpenDialog = (type: "create" | "edit" | "delete", Class?: Class) => {
		setOpenDialog(type)
		setSelectedClass(Class ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedClass(null)
	}

	const columns: ColumnDef<Class>[] = [
		{
			accessorKey: "javerianaId",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("javerianaId")}</div>
			},
		},
		{
			id: "course",
			accessorFn: ({ course }) => `${course.name}`,
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Asignatura
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("course")}</div>,
		},
		{
			id: "professors",
			accessorFn: ({ professors }) =>
				professors && professors[0]
					? `${professors[0]?.name} ${professors[0]?.lastName} `
					: "No asignado",

			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Profesor
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("professors")}</div>,
		},
		{
			accessorKey: "period",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Periodo
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("period")}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const Class = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigate(`/admin/clases/${Class.classId}/miembros`)}>
								<User /> Lista de miembros
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", Class)}>
								<Pencil /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", Class)}>
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
		onColumnFiltersChange: setColumnFilters,
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
			columnFilters,
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
					<Button onClick={() => handleOpenDialog("create")}>Nueva clase</Button>
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
										No results.
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
			<EditClassDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				classData={selectedClass ?? undefined}
			/>
			<DeleteClassDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				classToDelete={selectedClass ?? undefined}
			/>
			<CreateClassDialog open={openDialog === "create"} onClose={handleCloseDialog} />
		</>
	)
}