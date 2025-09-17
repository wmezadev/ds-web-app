'use client'

import React, { useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'

import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Switch
} from '@mui/material'

import { PAYMENT_MODE_OPTIONS, POLICY_STATUS_OPTIONS, type PolicyFormInputs } from '@/types/policy'
import { useInsuranceLines } from '@/app/(dashboard)/policies/create/hooks/useInsuranceLines'
import { useInsuranceCompanies } from './hooks/useInsuranceCompanies'
import { ClientAutocomplete } from './components/ClientAutocomplete'

const POLICY_PERIOD_OPTIONS = [
  { value: 1, label: 'Mensual' },
  { value: 2, label: 'Bimensual' },
  { value: 3, label: 'Trimestral' },
  { value: 4, label: 'Cuatrimestral' },
  { value: 6, label: 'Semestral' },
  { value: 12, label: 'Anual' },
  { value: 0, label: 'Otros' }
]

export default function PolicyForm() {
  const [isHolderDifferent, setIsHolderDifferent] = React.useState(false)
  const { lines: insuranceLines, loading: linesLoading, error: linesError } = useInsuranceLines()
  const { companies: insuranceCompanies, loading: companiesLoading, error: companiesError } = useInsuranceCompanies()
  const today = new Date().toISOString().split('T')[0]

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid }
  } = useForm<PolicyFormInputs>({
    mode: 'onChange',
    defaultValues: {
      policy_number: '',
      holder_id: null,
      insured_id: null,
      insurance_company_id: null,
      policy_modality: 'I',
      line_id: null,
      status: 'A',
      is_new: true,
      issue_date: today,
      effective_date: '',
      expiration_date: '',
      policy_period: 12,
      is_renewable: true,
      has_co_insurance: false,
      payment_mode: 'O',
      insured_interest: '',
      collector_id: null,
      vehicle_id: null
    }
  })

  const effectiveDate = watch('effective_date')
  const holderId = watch('holder_id')

  const policyPeriod = watch('policy_period')

  useEffect(() => {
    if (effectiveDate && policyPeriod && policyPeriod > 0) {
      const startDate = new Date(effectiveDate)
      const expirationDate = new Date(startDate)

      expirationDate.setMonth(startDate.getMonth() + policyPeriod)

      const formattedExpiration = expirationDate.toISOString().split('T')[0]

      setValue('expiration_date', formattedExpiration)
    } else if (policyPeriod === 0) {
      setValue('expiration_date', '')
    }

    if (!isHolderDifferent && holderId) {
      setValue('insured_id', holderId, { shouldValidate: true })
    }
  }, [effectiveDate, policyPeriod, setValue, isHolderDifferent, holderId])

  const onSubmit = (data: PolicyFormInputs) => {
    console.log('Policy Created:', data)
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant='h5' mb={2}>
        Crear Póliza
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={<Switch checked={isHolderDifferent} onChange={e => setIsHolderDifferent(e.target.checked)} />}
              label='¿El tomador es distinto al asegurado?'
            />
          </Grid>
          <Grid item xs={12} md={isHolderDifferent ? 4 : 8}>
            <Controller
              name='holder_id'
              control={control}
              rules={{ required: isHolderDifferent ? 'Tomador requerido' : 'Asegurado y Tomador requerido' }}
              render={({ field, fieldState }) => (
                <ClientAutocomplete
                  label={isHolderDifferent ? 'Tomador' : 'Asegurado y Tomador'}
                  value={field.value}
                  onChange={newId => {
                    field.onChange(newId)
                    if (!isHolderDifferent) {
                      setValue('insured_id', newId, { shouldValidate: true })
                    }
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          {isHolderDifferent && (
            <Grid item xs={12} md={4}>
              <Controller
                name='insured_id'
                control={control}
                rules={{ required: 'Asegurado requerido' }}
                render={({ field, fieldState }) => (
                  <ClientAutocomplete
                    label='Asegurado'
                    value={field.value}
                    onChange={field.onChange}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2}>
          {/* Tipo de Póliza */}
          <Grid item xs={12}>
            <Controller
              name='is_new'
              control={control}
              render={({ field }) => (
                <FormControl component='fieldset'>
                  <Typography variant='subtitle1' gutterBottom>
                    Tipo de Póliza
                  </Typography>
                  <RadioGroup
                    row
                    {...field}
                    value={field.value ? 'new' : 'renewal'}
                    onChange={e => field.onChange(e.target.value === 'new')}
                  >
                    <FormControlLabel value='new' control={<Radio />} label='Nueva' />
                    <FormControlLabel value='renewal' control={<Radio />} label='Renovación' />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          {/* Tipo de Póliza */}
          <Grid item xs={12}>
            <Controller
              name='policy_modality'
              control={control}
              rules={{ required: 'Tipo de póliza requerido' }}
              render={({ field }) => (
                <FormControl component='fieldset'>
                  <Typography variant='subtitle1' gutterBottom>
                    Tipo
                  </Typography>
                  <RadioGroup row {...field} value={field.value} onChange={e => field.onChange(e.target.value)}>
                    <FormControlLabel value='I' control={<Radio />} label='Póliza' />
                    <FormControlLabel value='C' control={<Radio />} label='Certificado' />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name='policy_number'
              control={control}
              rules={{ required: 'Número de póliza requerido' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Número de Póliza'
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name='insurance_company_id'
              control={control}
              rules={{ required: 'Compañía requerida' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>Compañía</InputLabel>
                  <Select {...field} label='Compañía' disabled={companiesLoading}>
                    {insuranceCompanies.map(company => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                  {companiesError && (
                    <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                      {companiesError}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Interest */}
          <Grid item xs={12}>
            <Controller
              name='insured_interest'
              control={control}
              render={({ field }) => <TextField {...field} label='Interés Asegurado' fullWidth />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name='line_id'
              control={control}
              rules={{ required: 'Ramo requerido' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>Ramo</InputLabel>
                  <Select {...field} label='Ramo' disabled={linesLoading}>
                    {insuranceLines.map(line => (
                      <MenuItem key={line.id} value={line.id}>
                        {line.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                  {linesError && (
                    <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                      {linesError}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name='issue_date'
              control={control}
              rules={{ required: 'Fecha de emisión requerida' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Fecha de Emisión'
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ readOnly: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name='effective_date'
              control={control}
              rules={{ required: 'Fecha de inicio requerida' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Fecha de Inicio'
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name='expiration_date'
              control={control}
              rules={{ required: 'Fecha de vencimiento requerida' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label='Fecha de Vencimiento'
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name='policy_period'
              control={control}
              rules={{ required: 'Período requerido' }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Período</InputLabel>
                  <Select {...field} label='Período'>
                    {POLICY_PERIOD_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Payment Mode */}
          <Grid item xs={12} md={6}>
            <Controller
              name='payment_mode'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Modo de Pago</InputLabel>
                  <Select {...field} label='Modo de Pago'>
                    {PAYMENT_MODE_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* IDs adicionales */}
          <Grid item xs={12} md={6}>
            <Controller
              name='collector_id'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Cobrador (ID)'
                  type='text'
                  fullWidth
                  value={field.value ?? ''}
                  onChange={e => {
                    const onlyDigits = e.target.value.replace(/\D/g, '')

                    field.onChange(onlyDigits === '' ? null : Number(onlyDigits))
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name='vehicle_id'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Vehículo (ID)'
                  type='text'
                  fullWidth
                  value={field.value ?? ''}
                  onChange={e => {
                    const onlyDigits = e.target.value.replace(/\D/g, '')

                    field.onChange(onlyDigits === '' ? null : Number(onlyDigits))
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type='submit' variant='contained' disabled={isSubmitting || !isValid}>
            Guardar Póliza
          </Button>
        </Box>
      </form>
    </Paper>
  )
}
