'use client'

import React from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material'
import Pagination from '@mui/material/Pagination'

interface Column<T> {
  key: string | number
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  emptyMessage?: string
  page: number
  totalPages?: number
  onPageChange?: (page: number) => void
  itemsPerPage?: number
}

const DataTable = <T extends Record<string, any>>({
  columns,
  rows,
  emptyMessage = 'No hay datos disponibles',
  page,
  totalPages,
  onPageChange,
  itemsPerPage = 10
}: DataTableProps<T>) => {
  const safeRows = Array.isArray(rows) ? rows : []

  // Paginación en memoria
  const paginatedRows = safeRows.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const localTotalPages = totalPages ?? Math.max(1, Math.ceil(safeRows.length / itemsPerPage))

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {localTotalPages > 1 && (
          <Pagination
            count={localTotalPages}
            page={page}
            onChange={(_, value) => onPageChange && onPageChange(value)}
            color='primary'
            shape='rounded'
          />
        )}
      </Box>
    </Box>
  )
}

export default DataTable
