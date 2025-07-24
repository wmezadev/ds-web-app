'use client'

import React from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material'
import Pagination from '@mui/material/Pagination'

interface Column<T> {
  key: keyof T | string
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
  paginateLocally?: boolean // Nuevo prop para elegir tipo de paginación
}

const DataTable = <T extends Record<string, any>>({
  columns,
  rows,
  emptyMessage = 'No hay datos disponibles',
  page,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  paginateLocally = true // por defecto paginación local para compatibilidad
}: DataTableProps<T>) => {
  const safeRows = Array.isArray(rows) ? rows : []

  // Decidir qué filas mostrar según paginación
  const paginatedRows = paginateLocally ? safeRows.slice((page - 1) * itemsPerPage, page * itemsPerPage) : safeRows

  // Calcular total de páginas según tipo de paginación
  const computedTotalPages =
    totalPages ?? (paginateLocally ? Math.max(1, Math.ceil(safeRows.length / itemsPerPage)) : 1)

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={String(column.key)}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render((row as any)[column.key as keyof T], row)
                        : (row as any)[column.key as keyof T]}
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
        {computedTotalPages > 1 && onPageChange && (
          <Pagination
            count={computedTotalPages}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color='primary'
            shape='rounded'
          />
        )}
      </Box>
    </Box>
  )
}

export default DataTable
