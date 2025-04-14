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
import { ArrowUpDown, MoreHorizontal, Search, Sheet, Trash2 } from "lucide-react"
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
import { useEffect, useRef, useState } from "react"
import UserModel from "@/modules/core/models/user"
import {
	getClassMembers,
	updateClassProfessorMember,
	updateClassStudentMember,
} from "../services/membersService"
import Role from "@/modules/core/models/role"
import { useParams } from "react-router-dom"
import AddMembersDialog from "./AddMembersDialog"
import DeleteStudentClassDialog from "./deleteStudentDialog"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import Class from "@/modules/core/models/class"
import { all, AxiosError } from "axios"
import { FileLoader } from "../../fileLoader/FileLoaderButon"
import { FileDownloader } from "../../fileLoader/fileDownloaderButton"


export function StudentsClassDataTable() {

	const [sorting, setSorting] = useState<SortingState>([])
	const [filter, setFilter] = useState<string>("")
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const { id } = useParams()

	const [openDialog, setOpenDialog] = useState<"delete" | "students" | "professors" | null>(null)
	const [selectedStudent, setSelectedStudent] = useState<UserModel | undefined>(undefined)
	const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

	const [data, setData] = useState<UserModel[]>([])

	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 10, //default page size
	})

	const [paginationInfo, setPaginationInfo] = useState({
		total: 0, //total number of records
		totalPages: 0, //total number of pages
	})

	//PARA HOJAS DE EXCEL
	const [excelData, setExcelData] = useState<Record<string, any>[] | null>(null)

	const handleExcelFile = (fileBuffer: ArrayBuffer) => {
			console.log("Leyendo archivo Excel...")
		
			const workbook = XLSX.read(fileBuffer, { type: "buffer" })
			const workbookSheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[workbookSheetName]
			const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)
		
			const validFormat = data.every(
				(item) => "institutionalId" in item && "rol" in item && typeof item.rol === "string"
			)
		
			if (!validFormat) {
				toast.error("El formato del archivo Excel no es el esperado.")
				setExcelData(null)
				return
			}
		

			let results: Class[] = []

			let allCorrect = true

			const processData = async () => {
				const promises = data.map(async (item, index) => {
					if (item.rol.toLowerCase() === "profesor") {
						// Llama al servicio y agrega al resultado
						try {
							const updatedClass = await updateClassProfessorMember(
								Number(id),
								item.institutionalId
							)
							results.push(updatedClass)
						} catch (error) {
							console.log(error)
							toast.error(error instanceof AxiosError ? error.response?.data.data : `Error desconocido en la fila ${index + 1}`)
							allCorrect = false
						}
					} else if (item.rol.toLowerCase() === "estudiante") {
						// Llama al servicio y agrega al resultado
						try {
							const updatedClass = await updateClassStudentMember(Number(id), item.institutionalId)
							results.push(updatedClass)
						} catch (error) {

							toast.error(error instanceof AxiosError ? error.response?.data.data : `Error desconocido en la fila ${index + 1}`)
							allCorrect = false
						}
					} else {
						toast.error(`El rol ${item.rol.toLowerCase()} no es válido en la fila ${index + 1}`)
						allCorrect = false
					}
				})

				// Esperar a que todas las promesas se resuelvan
				await Promise.all(promises)

				// Evaluar después de que todos los await se hayan completado
				setExcelData(data)

				console.log("Datos leídos del Excel:", results.length)

				if (!allCorrect) {
					toast.warning("No se encontraron datos válidos de profesores o estudiantes.")
				} else {
					toast.success("Archivo Excel procesado exitosamente.")
				}
			}

			// Ejecutar la función asíncrona principal
			processData()
	}
	
	useEffect(() => {
		if (openDialog) return

		const fetchMembers = async () => {
			const res = await getClassMembers(
				pagination.pageIndex,
				pagination.pageSize,
				filter,
				sorting[0]?.id,
				!(sorting[0]?.desc ?? false),
				Number(id) //obtener el id de la url navigate(`/admin/classes/${Class.id}/members`)}
			)

			setData(res.data)

			setPaginationInfo({
				total: res.metadata.total,
				totalPages: res.metadata.totalPages,
			})
		}

		fetchMembers()
	}, [pagination, filter, sorting, openDialog, id, excelData])

	const handleOpenDialog = (type: "delete" | "students" | "professors", Usermodel?: UserModel) => {
		setOpenDialog(type)
		setSelectedStudent(Usermodel ?? undefined)
		setSelectedClassId(id ? Number(id) : null)
	}

	const handleCloseDialog = () => {
		setOpenDialog(null)
		setSelectedStudent(undefined)
	}

	const columns: ColumnDef<UserModel>[] = [
		{
			accessorKey: "institutionalId",
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
				return <div className="text-center">{row.getValue("institutionalId")}</div>
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
							Nombres
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
		},
		{
			accessorKey: "lastName",
			header: ({ column }) => (
				<div className="relative w-full">
					<Button
						variant="ghost"
						className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Apellidos
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("lastName")}</div>,
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
						Correo
						{column.getIsSorted() && <ArrowUpDown />}
					</Button>
				</div>
			),
			cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
		},
		{
			accessorKey: "roles",
			header: ({ column }) => {
				return (
					<div className="relative w-full">
						<Button
							variant="ghost"
							className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							Cargo
							{column.getIsSorted() && <ArrowUpDown />}
						</Button>
					</div>
				)
			},
			cell: ({ row }) => {
				const roles = row.getValue("roles") as Role[]

				let displayRole = "Sin rol"
				if (roles.includes(Role.PROFESOR)) {
					displayRole = Role.PROFESOR.toLowerCase()
				} else if (roles.includes(Role.ESTUDIANTE)) {
					displayRole = Role.ESTUDIANTE.toLowerCase()
				}

				return <div className="text-center">{displayRole}</div>
			},
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
					<div className="flex items-center space-x-2">
						<Button onClick={() => handleOpenDialog("students")}>Añadir estudiantes</Button>
						<Button onClick={() => handleOpenDialog("professors")}>Añadir profesores</Button>
						<div>
							<FileLoader onFileLoaded={handleExcelFile}  buttonText="Subir Archivo" />
						</div>
						<FileDownloader fileName="class members" />
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
			<AddMembersDialog
				open={openDialog === "students" || openDialog === "professors"}
				onClose={handleCloseDialog}
				classId={Number(id)}
				isStudent={openDialog === "students"}
			/>
			<DeleteStudentClassDialog
				open={openDialog === "delete"}
				onClose={handleCloseDialog}
				studentToDelete={selectedStudent}
				classId={selectedClassId ?? 0}
			/>
		</>
	)
}
