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
import { EditUserDialog } from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import CreateUserDialog from "./CreateUserDialog";
import { User } from "@/modules/core/models/user";

const initialData: User[] = [
  {
      id: 1,
      email: "andresgarciam@javeriana.edu.co",
      name: "Santi",
      lastName: "Castro",
      institutionalId: 45671,
      roles: ["ESTUDIANTE", "ADMIN"],
  },
  // Más usuarios...
];

export function UsersDataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [openDialog, setEditDialog] = useState<"edit" | "delete" | "create" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [data, setData] = useState<User[]>([]);

  const [pagination, setPagination] = useState({
      pageIndex: 0, //initial page index
      pageSize: 10, //default page size
  });

  const [paginationInfo, setPaginationInfo] = useState({
      total: 0, //total number of records
      totalPages: 0, //total number of pages
  });

  useEffect(() => {
      const fetchUsers = async () => {
          setData([...initialData]); // ✅ Ahora sí estamos usando la constante "data"
          console.log([...initialData]); // ✅ Mostramos los datos en consola
          setPaginationInfo({
              total: data.length, // ✅ Usamos "data" para obtener el total
              totalPages: Math.ceil(data.length / pagination.pageSize),
          });
      };
      fetchUsers();
  }, [pagination, data.length]);

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
          accessorKey: "id",
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
              return <div className="text-center">{row.getValue("id")}</div>;
          },
      },
      {
          accessorKey: "email",
          header: ({ column }) => {
              return (
                  <div className="relative w-full">
                      <Button
                          variant="ghost"
                          className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
                          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                          Email
                          {column.getIsSorted() && <ArrowUpDown />}
                      </Button>
                  </div>
              );
          },
          cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
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
              );
          },
          cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
      },
      {
          accessorKey: "lastName",
          header: ({ column }) => {
              return (
                  <div className="relative w-full">
                      <Button
                          variant="ghost"
                          className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
                          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                          Apellido
                          {column.getIsSorted() && <ArrowUpDown />}
                      </Button>
                  </div>
              );
          },
          cell: ({ row }) => <div className="text-center">{row.getValue("lastName")}</div>,
      },
      {
          accessorKey: "institutionalId",
          header: ({ column }) => {
              return (
                  <div className="relative w-full">
                      <Button
                          variant="ghost"
                          className="absolute top-1/2 left-1/2 mx-auto flex -translate-1/2"
                          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                          ID Institucional
                          {column.getIsSorted() && <ArrowUpDown />}
                      </Button>
                  </div>
              );
          },
          cell: ({ row }) => <div className="text-center">{row.getValue("institutionalId")}</div>,
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
                          Roles
                          {column.getIsSorted() && <ArrowUpDown />}
                      </Button>
                  </div>
              );
          },
          cell: ({ row }) => <div className="text-center">{row.getValue("roles").join(", ")}</div>,
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
                              <MoreHorizontal />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog("edit", user)}>
                              <Pencil /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenDialog("delete", user)}>
                              <Trash2 /> Borrar
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
  });

  return (
      <>
          <div className="w-full">
              <div className="flex items-center justify-between py-4">
                  <div className="relative w-1/2 max-w-sm">
                      <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
                      <Input
                          placeholder="Buscar..."
                          value={(table.getState().globalFilter as string) ?? ""}
                          onChange={(event) => table.setGlobalFilter(event.target.value)}
                          className="w-full pl-8"
                      />
                  </div>
                  <Button onClick={() => handleOpenDialog("create", undefined)}>Nuevo usuario</Button>
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
                                      );
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
          <EditUserDialog
              open={openDialog === "edit"}
              onClose={handleCloseDialog}
              user={selectedUser ?? undefined}
          />
          <DeleteUserDialog open={openDialog === "delete"} onClose={handleCloseDialog} />
          <CreateUserDialog
              open={openDialog === "create"}
              onClose={handleCloseDialog}
              user={undefined}
          />
      </>
  );
}