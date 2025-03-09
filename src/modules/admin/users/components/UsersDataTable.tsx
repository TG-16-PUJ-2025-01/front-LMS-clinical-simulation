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
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/modules/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";
import { Input } from "@/modules/core/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/ui/table";
import { useEffect, useState } from "react";

import DeleteUserDialog from "./DeleteUserDialog";
import CreateUserDialog from "./CreateUserDialog";

import { getUsers } from "../services/userService";
import EditUserDialog from "./EditUserDialog";
import User from "@/modules/core/models/user";
import { UpdateMailConfigDialog } from "./UpdateMailConfigDialog";

export function UsersDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [openDialog, setEditDialog] = useState<"edit" | "delete" | "create" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [openMailConfigDialog, setOpenMailConfigDialog] = useState(false);

  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (openDialog) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sortColumn = sorting[0]?.id || "id";
        const sortDirection = sorting[0]?.desc ? false : true;

        const res = await getUsers(
          pagination.pageIndex,
          pagination.pageSize,
          filter || "", // Enviar filtro
          sortColumn === "fullName" ? "lastName" : sortColumn, // Reemplaza fullName por lastName
          sortDirection
        );

        if (res.data) {
          setData(res.data);
          setPaginationInfo({
            total: res.metadata.total,
            totalPages: res.metadata.totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.response?.data?.message || "Error al cargar los usuarios");
        setData([]);
        setPaginationInfo({
          total: 0,
          totalPages: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };


    fetchUsers();
  }, [pagination.pageIndex, pagination.pageSize, filter, sorting, openDialog]);

  const handleOpenDialog = (type: "create" | "edit" | "delete", user?: User) => {
    setEditDialog(type);
    setSelectedUser(user ?? null);
  };

  const handleCloseDialog = () => {
    setEditDialog(null);
    setSelectedUser(null);
  };

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
        <div className="text-center">
          {`${row.original.lastName} ${row.original.name}`}
        </div>
      ),
    },
    {
      accessorKey: "roles",
      header: ({ column }) => (
        <div className="relative w-full">
          <Button
            variant="ghost"
            className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
          >
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
        const user = row.original;
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
        );
      },
    },
  ];

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
  });

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
                setFilter(event.target.value);
                setPagination({ ...pagination, pageIndex: 0 });
              }}
              className="w-full pl-8"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={() => setOpenMailConfigDialog(true)}>
              Configurar servidor de correo
            </Button>
            <Button onClick={() => handleOpenDialog("create")}>Nuevo usuario</Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-md border">
            <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="pl-5"> {/* Added className="pl-4" */}
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
                  <TableCell key={cell.id} className="pl-5"> {/* Added className="pl-4" */}
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
      <CreateUserDialog
        open={openDialog === "create"}
        onClose={handleCloseDialog}
      />

      <UpdateMailConfigDialog
        open={openMailConfigDialog}
        onClose={() => setOpenMailConfigDialog(false)}
      />
    </>
  );
}