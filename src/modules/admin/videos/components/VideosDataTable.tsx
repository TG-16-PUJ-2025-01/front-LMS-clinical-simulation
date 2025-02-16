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
import {
	ArrowUpDown,
	MoreHorizontal,
	Pencil,
	Search,
	Trash2,
	Video as VideoIcon,
} from "lucide-react"

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
import Video from "@/modules/core/models/video"
import { formatDuration, formatSize } from "@/modules/core/lib/utils"
import EditVideoDialog from "./EditVideoDialog"
import DeleteVideoDialog from "./DeleteVideoDialog"
import WatchVideoDialog from "./WatchVideoDialog"
import { useEffect, useState } from "react"
import { getVideos } from "../services/videoService"

export function VideosDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [openDialog, setOpenDialog] = useState<"view" | "edit" | "delete" | null>(null)
	const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

	const [data, setData] = useState<Video[]>([])

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

		const fetchVideos = async () => {
			const res = await getVideos(
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

		fetchVideos()
	}, [pagination, filter, sorting, openDialog])

	const handleOpenDialog = (type: "view" | "edit" | "delete", video: Video) => {
		setOpenDialog(type)
		setSelectedVideo(video)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedVideo(null)
	}

	const columns: ColumnDef<Video>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="mx-auto flex"
						onClick={() => {
							column.toggleSorting(column.getIsSorted() === "asc")
							setPagination({ ...pagination, pageIndex: 0 })
						}}
					>
						Nombre del Video
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("name")}</div>
			},
		},
		{
			accessorKey: "recordingDate",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="mx-auto flex"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc")
								setPagination({ ...pagination, pageIndex: 0 })
							}}
						>
							Fecha de Grabación
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => (
				<div className="text-center">
					{(row.getValue("recordingDate") as Date).toLocaleDateString()}
				</div>
			),
		},
		{
			accessorKey: "expirationDate",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="mx-auto flex"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc")
								setPagination({ ...pagination, pageIndex: 0 })
							}}
						>
							Fecha de Expiración
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => (
				<div className="text-center">
					{(row.getValue("expirationDate") as Date).toLocaleDateString()}
				</div>
			),
		},
		{
			accessorKey: "duration",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="mx-auto flex"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc")
								setPagination({ ...pagination, pageIndex: 0 })
							}}
						>
							Duración
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => (
				<div className="text-center">{formatDuration(row.getValue("duration"))}</div>
			),
		},
		{
			accessorKey: "size",
			header: ({ column }) => {
				return (
					<div className="relative">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc")
								setPagination({ ...pagination, pageIndex: 0 })
							}}
						>
							Tamaño
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{formatSize(row.getValue("size"))}</div>,
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const video = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => handleOpenDialog("view", video)}>
								<VideoIcon /> Ver video
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", video)}>
								<Pencil /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", video)}>
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
				<div className="flex items-center py-4">
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
			<WatchVideoDialog
				open={openDialog === "view"}
				onClose={handleCloseDialog}
				video={selectedVideo!}
			/>
			<EditVideoDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				video={selectedVideo!}
			/>
			<DeleteVideoDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				video={selectedVideo!}
			/>
		</>
	)
}
