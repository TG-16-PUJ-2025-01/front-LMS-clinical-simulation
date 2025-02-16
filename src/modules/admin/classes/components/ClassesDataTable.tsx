"use client"
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
import { ArrowUpDown, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
import { Button } from "@/modules/core/components/ui/button"
import { Checkbox } from "@/modules/core/components/ui/checkbox"
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

const initialData: Class[] = [
	{
		id: 23,
		name: "ken99@yahoo.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 343,
		name: "Abe45@gmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 1243,
		name: "Monserrat44@gmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 2321,
		name: "Silas22@gmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 6654,
		name: "carmella@hotmail.com",
		course: "course2",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 302,
		name: "carmella@hotmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 9302,
		name: "carmella@hotmail.com",
		course: "course3",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 93920,
		name: "carmella@hotmail.com",
		course: "course4",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 92912,
		name: "carmella@hotmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 19291,
		name: "carmella@hotmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
	{
		id: 1391,
		name: "carmella@hotmail.com",
		course: "course1",
		startDate: new Date(),
		endDate: new Date(),
		professor: "professor1",
	},
]
export function ClassesDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [openDialog, setEditDialog] = useState<"edit" | "delete" | null>(null)
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
		const fetchClasses = async () => {
			setData([...initialData]) // ✅ Ahora sí estamos usando la constante "data"
			console.log([...initialData]) // ✅ Mostramos los datos en consola
			setPaginationInfo({
				total: data.length, // ✅ Usamos "data" para obtener el total
				totalPages: Math.ceil(data.length / pagination.pageSize),
			})
		}
		fetchClasses()
	}, [pagination])

	const handleOpenDialog = (type: "edit" | "delete", Class: Class) => {
		setEditDialog(type)
		setSelectedClass(Class)
	}

	const handleCloseDialog = () => {
		setEditDialog(null)
		setSelectedClass(null)
	}

	const columns: ColumnDef<Class>[] = [
		{
			accessorKey: "id",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID la clase
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("id")}</div>
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
			accessorKey: "course",
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
			accessorKey: "professor",
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
			cell: ({ row }) => <div className="text-center">{row.getValue("professor")}</div>,
		},
		{
			accessorKey: "startDate",
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
			cell: ({ row }) => (
				<div className="text-center">
					{(row.getValue("startDate") as Date).toLocaleDateString()}
				</div>
			),
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
				<div className="flex items-center py-4">
					<div className="relative w-1/2 max-w-sm">
						<Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
						<Input
							placeholder="Buscar..."
							value={(table.getState().globalFilter as string) ?? ""}
							onChange={(event) => table.setGlobalFilter(event.target.value)}
							className="w-full pl-8"
						/>
					</div>
				</div>
				<div className="rounded-md border">
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
				<div className="flex items-center justify-end space-x-2 py-4">
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
			<DeleteClassDialog open={openDialog === "delete"} onClose={handleCloseDialog} />
		</>
	)
}

export const columns: ColumnDef<Class>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: () => <div>id</div>,
		cell: ({ row }) => {
			return <div className="font-medium">{row.getValue("id")}</div>
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nombre
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const Class = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(Class.id.toString())}>
							Copy Class ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View Class details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
