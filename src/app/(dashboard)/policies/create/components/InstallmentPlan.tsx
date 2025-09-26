'use client'

import React, { useState } from 'react'

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'

interface InstallmentFormData {
  period_months: number
  installments_count: number
  annual_premium: string
}

interface InstallmentPlanProps {
  onCalculate?: (data: InstallmentFormData) => void
}

const PERIOD_OPTIONS = [
  { value: 1, label: '1 mes' },
  { value: 2, label: '2 meses' },
  { value: 3, label: '3 meses' },
  { value: 4, label: '4 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' }
]

const INSTALLMENTS_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} cuota${i + 1 === 1 ? '' : 's'}`
}))

const InstallmentPlan = ({ onCalculate }: InstallmentPlanProps) => {
  const [isCalculating, setIsCalculating] = useState(false)

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<InstallmentFormData>({
    defaultValues: {
      period_months: 12,
      installments_count: 1,
      annual_premium: ''
    }
  })

  const handleCalculate = async () => {
    const data = getValues()
    setIsCalculating(true)

    try {
      if (onCalculate) {
        await onCalculate(data)
      }
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Panel Izquierdo */}
      <Grid item xs={12} md={2}>
        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
          Fraccionamiento
        </Typography>

        <Grid container spacing={2}>
          {/* Período */}
          <Grid item xs={12}>
            <Controller
              name='period_months'
              control={control}
              rules={{ required: 'El período es requerido' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error} size='small'>
                  <InputLabel>Período</InputLabel>
                  <Select {...field} label='Período'>
                    {PERIOD_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Cuotas */}
          <Grid item xs={12}>
            <Controller
              name='installments_count'
              control={control}
              rules={{ required: 'El número de cuotas es requerido' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error} size='small'>
                  <InputLabel>Cuotas</InputLabel>
                  <Select {...field} label='Cuotas'>
                    {INSTALLMENTS_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Prima Anual */}
          <Grid item xs={12}>
            <Controller
              name='annual_premium'
              control={control}
              rules={{
                required: 'La prima anual es requerida',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'Ingrese un monto válido (ej: 1000.00)'
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Prima Anual'
                  fullWidth
                  size='small'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder='0.00'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Button variant='outlined' onClick={handleCalculate} disabled={isCalculating} size='small' fullWidth>
                {isCalculating ? 'Calculando...' : 'Calcular'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Panel Derecho - Plan de Fraccionamiento */}
      <Grid item xs={12} md={10}>
        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
          Plan de Fraccionamiento
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            color: 'text.secondary',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'grey.50'
          }}
        >
          <Typography variant='body1' align='center'>
            Los resultados del cálculo aparecerán aquí
            <br />
            <Typography variant='body2' sx={{ mt: 1 }}>
              Complete los campos y presione "Calcular"
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default InstallmentPlan
