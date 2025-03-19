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
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/modules/core/components/ui/carousel"

export function CoursesDataTable() {
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

		const fetchClasses = async () => {}

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
			<div className="w-full">
				<div className="flex items-center justify-between\">
					<h1>ASIGNATURA 1 </h1>
					<Button>Recomendar rubrica</Button>				</div>
				<div className="mt-4 rounded-md border">
					<Carousel>
						<CarouselContent>
							<CarouselItem>...</CarouselItem>
							<CarouselItem>...</CarouselItem>
							<CarouselItem>...</CarouselItem>
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>
			</div>
		</>
	)
}
