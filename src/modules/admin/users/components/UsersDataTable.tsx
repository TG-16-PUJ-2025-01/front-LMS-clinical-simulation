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
import { useEffect, useState } from "react"

import DeleteUserDialog from "./DeleteUserDialog"
import CreateUserDialog from "./CreateUserDialog"

import { createUserByExcel, getUsers } from "../services/userService"
import EditUserDialog from "./EditUserDialog"
import User from "@/modules/core/models/user"
import { UpdateMailConfigDialog } from "./UpdateMailConfigDialog"
import { FileLoader } from "@/modules/shared/fileLoader/FileLoaderButon"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import Role from "@/modules/core/models/role"
import { FileDownloader } from "@/modules/shared/fileLoader/fileDownloaderButton"
import { AxiosError } from "axios"

export function UsersDataTable() {
	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const [openDialog, setEditDialog] = useState<"edit" | "delete" | "create" | null>(null)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)

	const [openMailConfigDialog, setOpenMailConfigDialog] = useState(false)

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const [paginationInfo, setPaginationInfo] = useState({
		total: 0,
		totalPages: 0,
	})

	const [data, setData] = useState<User[]>([])

	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const [excelData, setExcelData] = useState<Record<string, any>[] | null>(null)

	useEffect(() => {
		if (openDialog) return

		const fetchUsers = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const sortColumn = sorting[0]?.id || "id"
				const sortDirection = sorting[0]?.desc ? false : true

				const res = await getUsers(
					pagination.pageIndex,
					pagination.pageSize,
					filter || "", // Enviar filtro
					sortColumn === "fullName" ? "lastName" : sortColumn, // Reemplaza fullName por lastName
					sortDirection
				)

				if (res.data) {
					setData(res.data)
					setPaginationInfo({
						total: res.metadata.total,
						totalPages: res.metadata.totalPages,
					})
				}
			} catch (error: any) {
				console.error("Error fetching users:", error)
				setError(error.response?.data?.message || "Error al cargar los usuarios")
				setData([])
				setPaginationInfo({
					total: 0,
					totalPages: 0,
				})
			} finally {
				setIsLoading(false)
			}
		}

		fetchUsers()
	}, [pagination.pageIndex, pagination.pageSize, filter, sorting, openDialog, refreshTrigger])

	const handleExcelFile = (fileBuffer: ArrayBuffer) => {
		const workbook = XLSX.read(fileBuffer, { type: "buffer" })
		const workbookSheetName = workbook.SheetNames[0]
		const worksheet = workbook.Sheets[workbookSheetName]
		const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)

		let validFormat = true

		if (!neededFields(data)) {
			toast.error("El formato del archivo Excel no es el esperado.")
			setExcelData(null)
			return
		}

		setExcelData(data)

		let results: User[] = []

		let allCorrect = true

		const processData = async () => {
			const promises = data.map(async (item, index) => {
				// Evaluar si el rol es el correcto
				let roles = Object.keys(item)
					.filter((key) => key.trim().startsWith("rol"))
					.map((key) => item[key])
					.filter((id) => id !== undefined && id !== null && id !== "")

				if (roles.length === 0) {
					allCorrect = false
					toast.error(
						`Error en la fila ${index + 1}: el rol no es correcto, por favor verifique el archivo.`
					)
					return
				}

				const isValidRole = roles.every((role) => Object.values(Role).includes(role))

				if (!isValidRole) {
					allCorrect = false
					toast.error(`Error en la fila ${index + 1}: el rol no es válido.`)
					return
				}

				try {
					await createUserByExcel({
						institutionalId: item.idInstitucional,
						name: item.nombre,
						lastName: item.apellido,
						email: item.email,
						roles,
					})
				} catch (error) {
					allCorrect = false
					console.error(`Error al crear el usuario en la fila ${index + 1}:`, error)

					// Puedes incluso extraer más detalle del error si viene con mensaje del backend
					toast.error(`Error en la fila ${index + 1}`)
				}
			})

			// Esperar a que todas las promesas se resuelvan
			await Promise.all(promises)

			// Evaluar después de que todos los await se hayan completado

			console.log("Datos leídos del Excel:", results.length)

			if (!allCorrect) {
				toast.warning("Hay datos erroneos en el excel, por favor verifique el archivo.")
			} else {
				setExcelData(data)
				setRefreshTrigger((prev) => prev + 1)
				toast.success("Archivo Excel procesado exitosamente.")
			}
		}
		// Ejecutar la función asíncrona principal
		processData()
	}

	function neededFields(data: Record<string, any>[]) {
		const requiredFields = ["idInstitucional", "nombre", "apellido", "email"]

		for (let i = 0; i < data.length; i++) {
			const row = data[i]

			// Ignorar filas vacías
			if (Object.keys(row).length === 0) {
				continue
			}

			const rowKeys = Object.keys(row).map((k) => k.trim())

			const hasAllFields = requiredFields.every((field) => rowKeys.includes(field))

			const hasRoleField = rowKeys.some((key) => key.startsWith("rol"))

			if (!hasAllFields && !hasRoleField) {
				return false
			}
		}

		return true
	}

	const handleOpenDialog = (type: "create" | "edit" | "delete", user?: User) => {
		setEditDialog(type)
		setSelectedUser(user ?? null)
	}

	const handleCloseDialog = () => {
		setEditDialog(null)
		setSelectedUser(null)
	}

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "institutionalId",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID Institucional
						{column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("institutionalId")}</div>,
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Email
						{column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
		},
		{
			accessorKey: "fullName",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Nombre Completo
						{column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
					</Button>
				</div>
			),
			cell: ({ row }) => (
				<div className="text-center">{`${row.original.lastName} ${row.original.name}`}</div>
			),
		},
		{
			accessorKey: "roles",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button variant="ghost" className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2">
						Roles
						{column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
					</Button>
				</div>
			),
			cell: ({ row }) => (
				<div className="text-center">
					{(row.getValue("roles") as string[])
						.map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
						.join(", ")}
				</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const user = row.original
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => handleOpenDialog("edit", user)}>
								<Pencil className="mr-2 h-4 w-4" /> Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleOpenDialog("delete", user)}>
								<Trash2 className="mr-2 h-4 w-4" /> Borrar
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
				<div className="flex items-center justify-between gap-2">
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

					<div className="flex space-x-2">
						<Button onClick={() => setOpenMailConfigDialog(true)}>
							Configurar servidor de correo
						</Button>
						<Button onClick={() => handleOpenDialog("create")}>Nuevo usuario</Button>
						<FileLoader onFileLoaded={handleExcelFile} buttonText="Subir Archivo" />
						<FileDownloader fileName="users" />
					</div>
				</div>

				{error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

				<div className="mt-4 rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="pl-5">
											{" "}
											{/* Added className="pl-4" */}
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										Cargando...
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="pl-5">
												{" "}
												{/* Added className="pl-4" */}
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
							disabled={!table.getCanPreviousPage() || isLoading}
						>
							Anterior
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage() || isLoading}
						>
							Siguiente
						</Button>
					</div>
				</div>
			</div>

			<EditUserDialog
				open={openDialog === "edit"}
				onClose={handleCloseDialog}
				user={selectedUser ?? undefined}
			/>
			<DeleteUserDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				user={selectedUser ?? undefined}
			/>
			<CreateUserDialog open={openDialog === "create"} onClose={handleCloseDialog} />

			<UpdateMailConfigDialog
				open={openMailConfigDialog}
				onClose={() => setOpenMailConfigDialog(false)}
			/>
		</>
	)
}
