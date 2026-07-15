import type { ReactNode } from "react"

import type { Page } from "@/api/types"
import { PaginationControls } from "@/components/data/PaginationControls"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

interface PaginatedTableProps<T> {
  columns: Column<T>[]
  page: Page<T>
  rowKey: (row: T) => string | number
  onPageChange: (page: number) => void
  emptyMessage: ReactNode
  
  isFetching?: boolean
}

export function PaginatedTable<T>({
  columns,
  page,
  rowKey,
  onPageChange,
  emptyMessage,
  isFetching = false,
}: PaginatedTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border">
        <Table className={cn(isFetching && "opacity-60")}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {page.empty ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              page.content.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls page={page} onPageChange={onPageChange} />
    </div>
  )
}
