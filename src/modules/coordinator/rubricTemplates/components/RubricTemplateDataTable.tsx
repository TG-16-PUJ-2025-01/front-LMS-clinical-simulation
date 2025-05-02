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
import { ArrowUpDown, Eye, Inbox, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
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
import EditRubricTemplateDialog from "./EditRubricTemplateDialog"
import DeleteRubricTemplateDialog from "./DeleteRubricTemplateDialog"
import { useEffect, useState } from "react"
import CreateRubricTemplateDialog from "./CreateRubricTemplateDialog"
import RubricTemplate from "@/modules/core/models/rubricTemplate"
import { getRubricTemplates } from "../services/rubricTemplateService"
import { RadioGroup, RadioGroupItem } from "@/modules/core/components/ui/radio-group"
import { Label } from "@/modules/core/components/ui/label"
import ArchiveRubricTemplateDialog from "./ArchiveRubricTemplateDialog"
import ViewRubricTemplateDialog from "./ViewRubricTemplateDialog"

export function RubricTemplateDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [archived, setArchived] = useState<"all" | "archived">("all")

	const [openDialog, setOpenDialog] = useState<
		"edit" | "delete" | "create" | "archive" | "view" | null
	>(null)
	const [selectedRubric, setSelectedRubric] = useState<RubricTemplate | null>(null)

	const [data, setData] = useState<RubricTemplate[]>([])

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
		const fetchRubricTemplates = async () => {
			const res = await getRubricTemplates(
				pagination.pageIndex,
				pagination.pageSize,
				filter,
				sorting[0]?.id,
				!(sorting[0]?.desc ?? false),
				archived === "archived"
			)

			setData(res.data)

			setPaginationInfo({
				total: res.metadata.total,
				totalPages: res.metadata.totalPages,
			})
		}

		fetchRubricTemplates()
	}, [pagination, filter, sorting, openDialog, archived])

	const handleOpenDialog = (
		type: "create" | "edit" | "delete" | "archive" | "view",
		rubric?: RubricTemplate
	) => {
		setOpenDialog(type)
		setSelectedRubric(rubric ?? null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedRubric(null)
	}

	const columns: ColumnDef<RubricTemplate>[] = [
		{
			accessorKey: "title",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Título
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("title")}</div>
			},
		},
		{
			accessorKey: "creationDate",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Fecha de creación
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => (
				<div className="text-center">
					{(row.getValue("creationDate") as Date).toLocaleDateString()}
				</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const rubric = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => handleOpenDialog("view", rubric)}>
								<Eye /> Ver
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", rubric)}>
								<Pencil /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("archive", rubric)}>
								<Inbox /> {rubric.archived ? "Desarchivar" : "Archivar"}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", rubric)}>
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
					<div className="flex w-full items-center space-x-4">
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
						<RadioGroup
							value={archived}
							onValueChange={(value) => setArchived(value as "all" | "archived")}
							className="flex items-center space-x-2"
						>
							<div className="flex items-center space-x-1">
								<RadioGroupItem value="all" id="r1" />
								<Label htmlFor="r1">Todas</Label>
							</div>
							<div className="flex items-center space-x-1">
								<RadioGroupItem value="archived" id="r2" />
								<Label htmlFor="r2">Mis Archivadas</Label>
							</div>
						</RadioGroup>
					</div>
					<Button onClick={() => handleOpenDialog("create")}>Nueva Rúbrica</Button>
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
										No results.
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
			<EditRubricTemplateDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				rubricTemplateData={selectedRubric ?? undefined}
			/>
			<DeleteRubricTemplateDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				rubricTemplateToDelete={selectedRubric ?? undefined}
			/>
			<ArchiveRubricTemplateDialog
				open={openDialog === "archive"}
				onClose={handleCloseDialog}
				rubricTemplateToArchive={selectedRubric ?? undefined}
			/>
			<CreateRubricTemplateDialog open={openDialog === "create"} onClose={handleCloseDialog} />
			<ViewRubricTemplateDialog
				open={openDialog === "view"}
				onClose={handleCloseDialog}
				rubricTemplateData={selectedRubric ?? undefined}
			/>
		</>
	)
}
