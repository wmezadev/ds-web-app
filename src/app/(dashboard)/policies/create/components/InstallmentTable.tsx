'use client'

import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField
} from '@mui/material'

interface InstallmentRow {
  numero: number
  desde: string
  hasta: string
  monto: number
}

interface InstallmentTableProps {
  installments: InstallmentRow[]
  onInstallmentChange?: (index: number, field: keyof InstallmentRow, value: string | number) => void
}

const InstallmentTable = ({ installments, onInstallmentChange }: InstallmentTableProps) => {
  const handleFieldChange = (index: number, field: keyof InstallmentRow, value: string | number) => {
    if (onInstallmentChange) {
      onInstallmentChange(index, field, value)
    }
  }

  if (installments.length === 0) {
    return (
      <Typography variant='body1' align='center' sx={{ py: 4, color: 'text.secondary' }}>
        Los resultados del cálculo aparecerán aquí
        <br />
        <Typography variant='body2' sx={{ mt: 1 }}>
          Complete los campos y presione "Calcular"
        </Typography>
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 60 }}>
              #
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80 }}>
              Desde
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80 }}>
              Hasta
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 120 }}>
              Monto Cuota
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100 }}>
              Recibo
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80 }}>
              Tipo
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80 }}>
              Estado
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80 }}>
              Moneda
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100 }}>
              Prima
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100 }}>
              IGTF
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, minWidth: 120 }}>
              Prima a Cobrar
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {installments.map((row, index) => (
            <TableRow key={row.numero} hover>
              <TableCell align='center'>{row.numero}</TableCell>
              <TableCell align='center'>
                <TextField
                  type='date'
                  value={row.desde}
                  onChange={e => handleFieldChange(index, 'desde', e.target.value)}
                  size='small'
                  variant='outlined'
                  sx={{ width: 140 }}
                />
              </TableCell>
              <TableCell align='center'>
                <TextField
                  type='date'
                  value={row.hasta}
                  onChange={e => handleFieldChange(index, 'hasta', e.target.value)}
                  size='small'
                  variant='outlined'
                  sx={{ width: 140 }}
                />
              </TableCell>
              <TableCell align='center'>
                <TextField
                  type='number'
                  value={row.monto}
                  onChange={e => handleFieldChange(index, 'monto', parseFloat(e.target.value) || 0)}
                  size='small'
                  variant='outlined'
                  inputProps={{ step: '0.01', min: '0' }}
                  sx={{ minWidth: 120 }}
                />
              </TableCell>

              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
              <TableCell align='center'></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InstallmentTable
