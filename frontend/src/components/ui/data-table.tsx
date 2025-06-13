"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumn?: string
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    onPageChange: (page: number) => void
  }
}

export function DataTable<TData, TValue>({ columns, data, searchColumn, pagination }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount || -1,
  })

  return (
    <div className="space-y-4">
      {searchColumn && (
        <div className="flex items-center">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {pagination
            ? `Page ${pagination.pageIndex + 1} of ${pagination.pageCount}`
            : `Showing ${table.getFilteredRowModel().rows.length} of ${data.length} row(s)`}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (pagination ? pagination.onPageChange(0) : table.setPageIndex(0))}
            disabled={pagination ? pagination.pageIndex === 0 : table.getState().pagination.pageIndex === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (pagination ? pagination.onPageChange(pagination.pageIndex - 1) : table.previousPage())}
            disabled={pagination ? pagination.pageIndex === 0 : !table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (pagination ? pagination.onPageChange(pagination.pageIndex + 1) : table.nextPage())}
            disabled={pagination ? pagination.pageIndex === pagination.pageCount - 1 : !table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(pagination.pageCount - 1)
                : table.setPageIndex(table.getPageCount() - 1)
            }
            disabled={pagination ? pagination.pageIndex === pagination.pageCount - 1 : !table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
