'use client'

import React, { useState } from 'react'

import { useForm, Controller } from 'react-hook-form'

import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Paper
} from '@mui/material'

import { useSnackbar } from '@/hooks/useSnackbar'
import { calculateInstallments } from '../utils/installmentCalculations'
import InstallmentTable from './InstallmentTable'

interface InstallmentFormData {
  period_months: number
  installments_count: number
  annual_premium: string
}

interface InstallmentPlanProps {
  onCalculate?: (data: InstallmentFormData) => void
  effectiveDate?: string // Fecha de vigencia de la póliza
}

interface InstallmentRow {
  numero: number
  desde: string
  hasta: string
  monto: number
}

const PERIOD_OPTIONS = [
  { value: 1, label: 'Mensual' },
  { value: 2, label: 'Bimensual' },
  { value: 3, label: 'Trimestral' },
  { value: 4, label: 'Cuatrimestral' },
  { value: 6, label: 'Semestral' },
  { value: 12, label: 'Anual' }
]

const INSTALLMENTS_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} cuota${i + 1 === 1 ? '' : 's'}`
}))

const InstallmentPlan = ({ onCalculate, effectiveDate }: InstallmentPlanProps) => {
  const [calculatedInstallments, setCalculatedInstallments] = useState<InstallmentRow[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const { showError, showWarning } = useSnackbar()

  const { control, getValues } = useForm<InstallmentFormData>({
    defaultValues: {
      period_months: 12,
      installments_count: 1,
      annual_premium: ''
    }
  })

  const handleInstallmentChange = (index: number, field: keyof InstallmentRow, value: string | number) => {
    const updatedInstallments = [...calculatedInstallments]

    updatedInstallments[index] = {
      ...updatedInstallments[index],

      [field]: value
    }
    setCalculatedInstallments(updatedInstallments)
  }

  const handleCalculate = async () => {
    const data = getValues()

    setIsCalculating(true)

    try {
      // Validar que tenemos todos los datos necesarios
      if (!data.annual_premium || data.annual_premium.trim() === '') {
        console.error('❌ Prima anual no proporcionada')
        showWarning('Por favor ingrese la prima anual')

        setIsCalculating(false)

        return
      }

      if (!effectiveDate || effectiveDate.trim() === '') {
        console.error('❌ Fecha efectiva no proporcionada')

        showWarning('Por favor seleccione una fecha de inicio de vigencia en el formulario principal')
        setIsCalculating(false)

        return
      }

      const annualPremium = parseFloat(data.annual_premium.replace(/,/g, ''))

      if (isNaN(annualPremium) || annualPremium <= 0) {
        showError('Por favor ingrese una prima anual válida (mayor a 0)')
        setIsCalculating(false)

        return
      }

      // Calcular las cuotas
      const installments = calculateInstallments({
        startDate: effectiveDate,
        periodMonths: data.period_months,
        installmentsCount: data.installments_count,
        annualPremium: annualPremium
      })

      setCalculatedInstallments(installments)

      if (onCalculate) {
        await onCalculate(data)
      }
    } catch (error) {
      console.error('❌ Error en el cálculo:', error)
      showError('Error al calcular las cuotas. Revise los datos ingresados.')
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

        {calculatedInstallments.length > 0 ? (
          <InstallmentTable installments={calculatedInstallments} onInstallmentChange={handleInstallmentChange} />
        ) : (
          <Paper
            variant='outlined'
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'grey.50',
              borderStyle: 'dashed',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant='body1' color='text.secondary' sx={{ mb: 1 }}>
              Plan de Fraccionamiento
            </Typography>
            <Typography variant='body2' color='text.disabled'>
              Complete los datos del fraccionamiento y presione "Calcular" para ver el plan de cuotas
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  )
}

export default InstallmentPlan
