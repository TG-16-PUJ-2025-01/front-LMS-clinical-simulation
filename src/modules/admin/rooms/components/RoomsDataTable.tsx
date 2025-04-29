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
import Room from "@/modules/core/models/room"
import EditRoomDialog from "./EditRoomDialog"
import DeleteRoomDialog from "./DeleteRoomDialog"
import { useEffect, useState } from "react"
import { getAllRooms } from "../services/roomService"
import AddRoomDialog from "./AddRoomDialog"

export function RoomsDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [openDialog, setEditDialog] = useState<"edit" | "delete" | "add" | null>(null)
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

	const [data, setData] = useState<Room[]>([])

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

		const fetchRooms = async () => {
			const res = await getAllRooms(
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
		fetchRooms()
	}, [pagination, filter, sorting, openDialog])

	const handleOpenDialog = (type: "edit" | "delete" | "add", room?: Room) => {
		setEditDialog(type)
		setSelectedRoom(room ?? null)
	}

	const handleCloseDialog = () => {
		setEditDialog(null)
		setSelectedRoom(null)
		setPagination((prev) => ({ ...prev }))
	}

	const columns: ColumnDef<Room>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Nombre de la Sala
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center capitalize">{row.getValue("name")}</div>
			},
		},
		{
			id: "type",
			accessorFn: (room) => room.type.name,
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Tipo de Sala
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("type")}</div>,
		},
		{
			id: "capacity",
			accessorKey: "capacity",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Capacidad
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("capacity")}</div>,
		},
		{
			id: "ip",
			accessorKey: "ip",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Dirección IP
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("ip")}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const room = row.original

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
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", room)}>
								<Pencil /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", room)}>
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
					<Button onClick={() => handleOpenDialog("add")}>Nueva Sala</Button>
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
			<EditRoomDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				room={selectedRoom!}
			/>
			<DeleteRoomDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				roomId={selectedRoom?.id ?? 0}
			/>
			<AddRoomDialog open={openDialog === "add"} onClose={handleCloseDialog} />
		</>
	)
}
