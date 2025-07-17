'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

interface Column<T> {
  key: keyof T
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
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={String(col.key)} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align='center'>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow key={idx} hover>
                {columns.map(col => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
