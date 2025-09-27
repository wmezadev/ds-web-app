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
    <TableContainer
      component={Paper}
      variant='outlined'
      sx={{
        height: '100%',
        maxHeight: 'calc(100vh - 350px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%'
      }}
    >
      <Table size='small' stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell align='center' sx={{ fontWeight: 600, width: '4%', p: 0.5 }}>
              #
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '12%', p: 0.5 }}>
              Desde
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '12%', p: 0.5 }}>
              Hasta
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '10%', p: 0.5 }}>
              Monto
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '9%', p: 0.5 }}>
              Recibo
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '8%', p: 0.5 }}>
              Tipo
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '9%', p: 0.5 }}>
              Estado
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '8%', p: 0.5 }}>
              Moneda
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '9%', p: 0.5 }}>
              Prima
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '9%', p: 0.5 }}>
              IGTF
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 600, width: '10%', p: 0.5 }}>
              P. Cobrar
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {installments.map((row, index) => (
            <TableRow key={row.numero} hover>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.75rem' }}>
                {row.numero}
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5 }}>
                <TextField
                  type='date'
                  value={row.desde}
                  onChange={e => handleFieldChange(index, 'desde', e.target.value)}
                  size='small'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      fontSize: '0.7rem',
                      minHeight: '28px'
                    },
                    '& .MuiInputBase-input': {
                      p: '2px 4px',
                      fontSize: '0.7rem'
                    }
                  }}
                />
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5 }}>
                <TextField
                  type='date'
                  value={row.hasta}
                  onChange={e => handleFieldChange(index, 'hasta', e.target.value)}
                  size='small'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      fontSize: '0.7rem',
                      minHeight: '28px'
                    },
                    '& .MuiInputBase-input': {
                      p: '2px 4px',
                      fontSize: '0.7rem'
                    }
                  }}
                />
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5 }}>
                <TextField
                  type='number'
                  value={row.monto}
                  onChange={e => handleFieldChange(index, 'monto', parseFloat(e.target.value) || 0)}
                  size='small'
                  variant='outlined'
                  inputProps={{ step: '0.01', min: '0' }}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      fontSize: '0.7rem',
                      minHeight: '28px'
                    },
                    '& .MuiInputBase-input': {
                      p: '2px 4px',
                      fontSize: '0.7rem',
                      textAlign: 'right'
                    },

                    '& input[type=number]': {
                      '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                      '-webkit-appearance': 'none',
                      margin: 0
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                      '-webkit-appearance': 'none',
                      margin: 0
                    }
                  }}
                />
              </TableCell>

              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
              <TableCell align='center' sx={{ p: 0.5, fontSize: '0.7rem' }}>
                -
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InstallmentTable
