"use client"

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/ui/table"
import { Button } from "@/modules/core/components/ui/button"
import { Input } from "@/modules/core/components/ui/input"
import { ArrowUpDown, Search } from "lucide-react"
import { useParams } from "react-router-dom"
import { getGradesByClassId, StudentGradeDto } from "../services/gradeService"


export default function GradeTable() {
  const params = useParams()
  const classId = Number(params?.classId)
  const [grades, setGrades] = useState<StudentGradeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  useEffect(() => {
    async function fetchGrades() {
      try {
        setLoading(true)
        const res = await getGradesByClassId(classId)
        setGrades(res.data)
      } catch (err) {
        console.error("Error al obtener calificaciones", err)
      } finally {
        setLoading(false)
      }
    }

    if (!isNaN(classId)) {
      fetchGrades()
    }
  }, [classId])

  const practiceNames = useMemo(() => {
    const set = new Set<string>()
    grades.forEach((g) =>
      Object.keys(g.practiceGrades).forEach((p) => set.add(p))
    )
    return Array.from(set)
  }, [grades])

  const columns: ColumnDef<StudentGradeDto>[] = useMemo(() => {
    const staticCols: ColumnDef<StudentGradeDto>[] = [
      {
        accessorKey: "studentName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Estudiante <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("studentName")}</div>,
      },
    ]

    const dynamicCols: ColumnDef<StudentGradeDto>[] = practiceNames.map(
      (practice) => ({
        accessorKey: `practiceGrades.${practice}`,
        id: practice,
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            {practice}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const value = row.original.practiceGrades[practice]
          return <div className="text-center">{value ?? "-"}</div>
        },
      })
    )

    const finalCol: ColumnDef<StudentGradeDto> = {
      accessorKey: "finalGrade",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Nota Final
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("finalGrade").toFixed(2)}
        </div>
      ),
    }

    return [...staticCols, ...dynamicCols, finalCol]
  }, [practiceNames])

  const table = useReactTable({
    data: grades,
    columns,
    state: {
      sorting,
      pagination,
      globalFilter: filter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
  })

  if (loading) return <div className="text-center py-10">Cargando...</div>

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/2 max-w-sm">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 stroke-zinc-500" />
          <Input
            placeholder="Buscar estudiante..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-zinc-600">
          Página {pagination.pageIndex + 1} de{" "}
          {Math.ceil(grades.length / pagination.pageSize)}
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
  )
}
