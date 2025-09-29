'use client'

import React, { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

interface CoInsuranceEntry {
  insurance_company_id: number | null
  percentage: string
  sum_insured: string
  retention_percentage: string
  premium: string
  commission: string
  bonus: string
  receipt_number: string
  premium_payment_date: string
  commission_payment_date: string | null
  bonus_payment_date: string | null
}

interface CoInsuranceTableProps {
  insuranceCompanies: Array<{ id: number; name: string }>
  onEntriesChange?: (entries: CoInsuranceEntry[]) => void
}

const CoInsuranceTable = ({ insuranceCompanies, onEntriesChange }: CoInsuranceTableProps) => {
  const [sumInsured, setSumInsured] = useState<string>('')
  const [premium, setPremium] = useState<string>('')
  const [commission, setCommission] = useState<string>('')
  const [entries, setEntries] = useState<CoInsuranceEntry[]>([])

  const handleCalculate = () => {
    const newEntry: CoInsuranceEntry = {
      insurance_company_id: null,
      percentage: '0.00',
      sum_insured: sumInsured || '0.00',
      retention_percentage: '0.00',
      premium: premium || '0.00',
      commission: commission || '0.00',
      bonus: '0.00',
      receipt_number: '',
      premium_payment_date: '',
      commission_payment_date: null,
      bonus_payment_date: null
    }

    const newEntries = [newEntry]

    setEntries(newEntries)

    if (onEntriesChange) {
      onEntriesChange(newEntries)
    }
  }

  const handleAddInsurer = () => {
    const newEntry: CoInsuranceEntry = {
      insurance_company_id: null,
      percentage: '0.00',
      sum_insured: '0.00',
      retention_percentage: '0.00',
      premium: '0.00',
      commission: '0.00',
      bonus: '0.00',
      receipt_number: '',
      premium_payment_date: '',
      commission_payment_date: null,
      bonus_payment_date: null
    }

    const updatedEntries = [...entries, newEntry]

    setEntries(updatedEntries)

    if (onEntriesChange) {
      onEntriesChange(updatedEntries)
    }
  }

  const handleDeleteInsurer = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index)

    setEntries(updatedEntries)

    if (onEntriesChange) {
      onEntriesChange(updatedEntries)
    }
  }

  const handleFieldChange = (index: number, field: keyof CoInsuranceEntry, value: string | number | null) => {
    const updatedEntries = [...entries]

    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    }
    setEntries(updatedEntries)

    if (onEntriesChange) {
      onEntriesChange(updatedEntries)
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
        Control de Póliza con Coaseguro
      </Typography>

      {/* Inputs de control */}
      <Paper sx={{ p: 3, mb: 3 }} variant='outlined'>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={3}>
            <TextField
              label='Suma Asegurada'
              type='number'
              value={sumInsured}
              onChange={e => setSumInsured(e.target.value)}
              fullWidth
              size='small'
              inputProps={{ step: '0.01', min: '0' }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label='Prima'
              type='number'
              value={premium}
              onChange={e => setPremium(e.target.value)}
              fullWidth
              size='small'
              inputProps={{ step: '0.01', min: '0' }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label='Comisión'
              type='number'
              value={commission}
              onChange={e => setCommission(e.target.value)}
              fullWidth
              size='small'
              inputProps={{ step: '0.01', min: '0' }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant='outlined' onClick={handleCalculate} fullWidth>
              Calcular
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de coaseguro */}
      {entries.length === 0 ? (
        <Paper sx={{ p: 4 }} variant='outlined'>
          <Typography variant='body1' align='center' sx={{ color: 'text.secondary' }}>
            Los resultados del cálculo aparecerán aquí
            <br />
            <Typography variant='body2' sx={{ mt: 1 }}>
              Complete los campos y presione &quot;Calcular&quot;
            </Typography>
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant='outlined'
          sx={{
            maxHeight: 'calc(100vh - 450px)',
            overflowY: 'auto',
            overflowX: 'auto'
          }}
        >
          <Table size='small' stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 150, p: 1 }}>
                  Aseguradoras
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100, p: 1 }}>
                  % CoAseguro
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 120, p: 1 }}>
                  Suma Asegurada
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100, p: 1 }}>
                  % Retención
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100, p: 1 }}>
                  Prima
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100, p: 1 }}>
                  Comisión
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 100, p: 1 }}>
                  Bono
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 120, p: 1 }}>
                  Recibo
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 130, p: 1 }}>
                  F.Pago Prima
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 150, p: 1 }}>
                  F.Pago Comisión
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 130, p: 1 }}>
                  F.Pago Bono
                </TableCell>
                <TableCell align='center' sx={{ fontWeight: 600, minWidth: 80, p: 1 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index} hover>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <FormControl fullWidth size='small'>
                      <Select
                        value={entry.insurance_company_id ?? ''}
                        onChange={e => handleFieldChange(index, 'insurance_company_id', Number(e.target.value))}
                        sx={{
                          fontSize: '0.75rem',
                          '& .MuiSelect-select': {
                            p: '4px 8px'
                          }
                        }}
                      >
                        {insuranceCompanies.map(company => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.percentage}
                      onChange={e => handleFieldChange(index, 'percentage', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0', max: '1' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.sum_insured}
                      onChange={e => handleFieldChange(index, 'sum_insured', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.retention_percentage}
                      onChange={e => handleFieldChange(index, 'retention_percentage', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0', max: '1' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.premium}
                      onChange={e => handleFieldChange(index, 'premium', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.commission}
                      onChange={e => handleFieldChange(index, 'commission', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='number'
                      value={entry.bonus}
                      onChange={e => handleFieldChange(index, 'bonus', e.target.value)}
                      size='small'
                      inputProps={{ step: '0.01', min: '0' }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px',
                          textAlign: 'right'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='text'
                      value={entry.receipt_number}
                      onChange={e => handleFieldChange(index, 'receipt_number', e.target.value)}
                      size='small'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='date'
                      value={entry.premium_payment_date}
                      onChange={e => handleFieldChange(index, 'premium_payment_date', e.target.value)}
                      size='small'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='date'
                      value={entry.commission_payment_date || ''}
                      onChange={e => handleFieldChange(index, 'commission_payment_date', e.target.value || null)}
                      size='small'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <TextField
                      type='date'
                      value={entry.bonus_payment_date || ''}
                      onChange={e => handleFieldChange(index, 'bonus_payment_date', e.target.value || null)}
                      size='small'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: '0.75rem',
                          p: '4px 8px'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ p: 0.5 }}>
                    <Tooltip title='Eliminar aseguradora'>
                      <IconButton
                        onClick={() => handleDeleteInsurer(index)}
                        color='error'
                        size='small'
                        disabled={entries.length === 1}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Botón para añadir aseguradora */}
      {entries.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant='outlined' startIcon={<AddIcon />} onClick={handleAddInsurer} size='small'>
            Añadir Aseguradora
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default CoInsuranceTable
export type { CoInsuranceEntry }
