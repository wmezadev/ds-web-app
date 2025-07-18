'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

interface Column<T> {
  key: string | number
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  emptyMessage?: string
}

const DataTable = <T extends Record<string, any>>({
  columns,
  rows,
  emptyMessage = 'No hay datos disponibles',
  itemsPerPage = 10
}: DataTableProps<T> & { itemsPerPage?: number }) => {
  const [page, setPage] = React.useState(1)

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  // Asegurarse de que rows sea un array
  const safeRows = Array.isArray(rows) ? rows : []
  const totalPages = Math.max(1, Math.ceil(safeRows.length / itemsPerPage))
  const paginatedRows = safeRows.slice((page - 1) * itemsPerPage, page * itemsPerPage)

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
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color='primary'
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}

export default DataTable
