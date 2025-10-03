'use client'

import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

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
  Switch,
  IconButton,
  Tooltip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { useApi } from '@/hooks/useApi'
import { useSnackbar } from '@/hooks/useSnackbar'

import {
  PAYMENT_MODE_OPTIONS,
  type PolicyFormInputs,
  type InstallmentPlanData,
  type PolicyCoverage
} from '@/types/policy'
import { useInsuranceLines } from '@/app/(dashboard)/policies/create/hooks/useInsuranceLines'
import { useInsuranceCompanies } from './hooks/useInsuranceCompanies'
import { useCollectors } from './hooks/useCollectors'
import { ClientAutocomplete } from './components/ClientAutocomplete'
import { VehicleAutocomplete } from './components/VehicleAutocomplete'
import VehicleModal from './components/VehicleModal'
import InstallmentPlan from './components/InstallmentPlan'
import CoInsuranceTable, { type CoInsuranceEntry } from './components/CoInsuranceTable'
import Coverages from './components/Coverages'

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
  const router = useRouter()
  const { fetchApi } = useApi()
  const { showSuccess, showError } = useSnackbar()
  const [isHolderDifferent, setIsHolderDifferent] = React.useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = React.useState(false)
  const [installmentPlanData, setInstallmentPlanData] = React.useState<InstallmentPlanData | null>(null)
  const [coInsuranceEntries, setCoInsuranceEntries] = React.useState<CoInsuranceEntry[]>([])
  const [selectedCoverages, setSelectedCoverages] = React.useState<PolicyCoverage[]>([])
  const { lines: insuranceLines, loading: linesLoading, error: linesError } = useInsuranceLines()
  const { companies: insuranceCompanies, loading: companiesLoading, error: companiesError } = useInsuranceCompanies()
  const { collectors, loading: collectorsLoading, error: collectorsError } = useCollectors()
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
      vehicle_id: null,
      policy_coverages: []
    }
  })

  const effectiveDate = watch('effective_date')
  const holderId = watch('holder_id')
  const lineId = watch('line_id')
  const paymentMode = watch('payment_mode')
  const hasCoInsurance = watch('has_co_insurance')

  const policyPeriod = watch('policy_period')

  const selectedLine = React.useMemo(() => {
    if (!lineId || !insuranceLines.length) return null

    return insuranceLines.find(line => line.id === lineId) || null
  }, [lineId, insuranceLines])

  const shouldShowVehicle = selectedLine?.entity === 'A'

  const handleAddVehicle = () => {
    setIsVehicleModalOpen(true)
  }

  const handleVehicleModalClose = () => {
    setIsVehicleModalOpen(false)
  }

  const handleVehicleCreated = () => {
    showSuccess('Vehículo creado exitosamente')
  }

  const handleInstallmentCalculate = async (data: InstallmentPlanData) => {
    setInstallmentPlanData(data)
  }

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

    if (!shouldShowVehicle) {
      setValue('vehicle_id', null)
    }

    // Limpiar datos de fraccionamiento si cambia a modo de pago único
    if (paymentMode !== 'I') {
      setInstallmentPlanData(null)
    }

    if (!hasCoInsurance) {
      setCoInsuranceEntries([])
    }
  }, [effectiveDate, policyPeriod, setValue, isHolderDifferent, holderId, shouldShowVehicle, paymentMode])

  const onSubmit = async (data: PolicyFormInputs) => {
    const payload: any = {
      policy_number: String(data.policy_number),
      holder_id: data.holder_id ? Number(data.holder_id) : null,
      insured_id: data.insured_id ? Number(data.insured_id) : null,
      insurance_company_id: data.insurance_company_id ? Number(data.insurance_company_id) : null,
      line_id: data.line_id ? Number(data.line_id) : null,
      status: data.status,
      is_new: data.is_new,
      issue_date: data.issue_date,
      effective_date: data.effective_date,
      expiration_date: data.expiration_date,
      policy_period: data.policy_period ? Number(data.policy_period) : null,
      is_renewable: data.is_renewable,
      has_co_insurance: data.has_co_insurance,
      payment_mode: data.payment_mode,
      insured_interest: data.insured_interest || '',
      collector_id: data.collector_id ? Number(data.collector_id) : null
    }

    if (data.vehicle_id) {
      payload.vehicle_id = Number(data.vehicle_id)
    }

    if (data.payment_mode === 'I') {
      if (installmentPlanData) {
        payload.installment_plan = installmentPlanData
      } else {
        payload.installment_plan = {
          period_months: data.policy_period || 12,
          installments_count: 0,
          annual_premium: '0.00',
          installments: []
        }
      }
    }

    if (data.has_co_insurance) {
      payload.co_insurance_entries = coInsuranceEntries.map(entry => ({
        insurance_company_id: entry.insurance_company_id,

        // Convertir porcentajes de 0-100 a decimal con 4 decimales
        percentage: ((parseFloat(entry.percentage) || 0) / 100).toFixed(4),
        sum_insured: parseFloat(entry.sum_insured || '0').toFixed(2),
        retention_percentage: ((parseFloat(entry.retention_percentage) || 0) / 100).toFixed(4),
        premium: parseFloat(entry.premium || '0').toFixed(2),
        commission: parseFloat(entry.commission || '0').toFixed(2),
        bonus: parseFloat(entry.bonus || '0').toFixed(2),
        receipt_number: entry.receipt_number || '',
        premium_payment_date: entry.premium_payment_date || null,
        commission_payment_date: entry.commission_payment_date || null,
        bonus_payment_date: entry.bonus_payment_date || null
      }))
    }

    // Add selected coverages with sum_insured
    if (selectedCoverages.length > 0) {
      payload.policy_coverages = selectedCoverages.map(coverage => ({
        coverage_id: coverage.coverage_id,
        status: coverage.status,
        sum_insured: parseFloat(coverage.sum_insured || '0').toFixed(2)
      }))
    }

    console.log('📤 Payload enviado al API:', JSON.stringify(payload, null, 2))

    try {
      await fetchApi('policies', {
        method: 'POST',
        body: payload
      })
      showSuccess('Póliza creada exitosamente')
      router.push('/policies')
    } catch (error) {
      console.error('Error creating policy:', error)
      showError('Error al crear la póliza')
    }
  }

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          Crear Póliza
        </Typography>
        <Button variant='outlined' onClick={() => router.back()} type='button'>
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={<Switch checked={isHolderDifferent} onChange={e => setIsHolderDifferent(e.target.checked)} />}
                label='¿El tomador es distinto al asegurado?'
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={isHolderDifferent ? 6 : 12}>
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
                  <Grid item xs={12} md={6}>
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
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid container item spacing={2} xs={12}>
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
              <Grid item xs={12} md={3}>
                <Controller
                  name='is_new'
                  control={control}
                  render={({ field }) => (
                    <FormControl component='fieldset'>
                      <Typography variant='subtitle1'>Póliza</Typography>
                      <RadioGroup
                        row
                        {...field}
                        value={field.value ? 'new' : 'renewal'}
                        onChange={e => field.onChange(e.target.value === 'new')}
                        sx={{ mt: -1 }}
                      >
                        <FormControlLabel value='new' control={<Radio />} label='Nueva' />
                        <FormControlLabel value='renewal' control={<Radio />} label='Renovación' />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name='policy_modality'
                  control={control}
                  rules={{ required: 'Tipo de póliza requerido' }}
                  render={({ field }) => (
                    <FormControl component='fieldset'>
                      <Typography variant='subtitle1'>Tipo de Póliza</Typography>
                      <RadioGroup
                        row
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        sx={{ mt: -1 }}
                      >
                        <FormControlLabel value='I' control={<Radio />} label='Individual' />
                        <FormControlLabel value='C' control={<Radio />} label='Colectivo' />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='insurance_company_id'
                control={control}
                rules={{ required: 'Compañía requerida' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Compañía</InputLabel>
                    <Select {...field} label='Compañía' value={field.value ?? ''} disabled={companiesLoading}>
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
            <Grid item xs={12} md={6}>
              <Controller
                name='line_id'
                control={control}
                rules={{ required: 'Ramo requerido' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Ramo</InputLabel>
                    <Select {...field} label='Ramo' value={field.value ?? ''} disabled={linesLoading}>
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

            <Grid item xs={12} md={shouldShowVehicle ? 6 : 12}>
              <Controller
                name='insured_interest'
                control={control}
                render={({ field }) => <TextField {...field} label='Interés Asegurado' fullWidth />}
              />
            </Grid>

            {shouldShowVehicle && (
              <Grid item xs={12} md={6}>
                <Box display='flex' alignItems='center' gap={1}>
                  <Box flexGrow={1}>
                    <Controller
                      name='vehicle_id'
                      control={control}
                      rules={{ required: shouldShowVehicle ? 'Vehículo requerido' : false }}
                      render={({ field, fieldState }) => (
                        <VehicleAutocomplete
                          label='Vehículo'
                          value={field.value}
                          onChange={field.onChange}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Box>
                  <Tooltip title='Agregar nuevo vehículo'>
                    <IconButton
                      onClick={handleAddVehicle}
                      color='primary'
                      sx={{
                        alignSelf: 'flex-start',
                        mt: '8px'
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} md={3}>
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

            <Grid item xs={12} md={3}>
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

            <Grid item xs={12} md={3}>
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

            <Grid item xs={12} md={3}>
              <Controller
                name='policy_period'
                control={control}
                rules={{ required: 'Período requerido' }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Período</InputLabel>
                    <Select {...field} label='Período' value={field.value ?? ''}>
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

            <Grid item xs={12} md={6}>
              <Controller
                name='payment_mode'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Modo de Pago</InputLabel>
                    <Select {...field} label='Modo de Pago' value={field.value ?? ''}>
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

            <Grid item xs={12} md={6}>
              <Controller
                name='collector_id'
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Cobrador</InputLabel>
                    <Select {...field} label='Cobrador' value={field.value ?? ''} disabled={collectorsLoading}>
                      {collectors.map(collector => (
                        <MenuItem key={collector.id} value={collector.id}>
                          {collector.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                    {collectorsError && (
                      <Typography variant='caption' color='error' sx={{ pl: 2 }}>
                        {collectorsError}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Controller
              name='has_co_insurance'
              control={control}
              render={({ field }) => (
                <FormControl component='fieldset'>
                  <FormControlLabel
                    control={<Switch checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />}
                    label='¿Tiene coaseguro?'
                  />
                </FormControl>
              )}
            />
          </Grid>

          {/* Mostrar InstallmentPlan cuando el modo de pago sea 'Fraccionado' */}
          {paymentMode === 'I' && (
            <InstallmentPlan onCalculate={handleInstallmentCalculate} effectiveDate={effectiveDate} />
          )}

          {/* Mostrar CoInsuranceTable cuando tiene coaseguro */}
          {hasCoInsurance && (
            <CoInsuranceTable insuranceCompanies={insuranceCompanies} onEntriesChange={setCoInsuranceEntries} />
          )}

          {/* Mostrar Coberturas cuando se selecciona un ramo */}
          <Coverages
            insuranceLineId={lineId}
            selectedCoverages={selectedCoverages}
            onSelectionChange={setSelectedCoverages}
          />

          <Box mt={3}>
            <Button type='submit' variant='contained' disabled={isSubmitting || !isValid}>
              Guardar Póliza
            </Button>
          </Box>
        </form>
      </Paper>

      <VehicleModal open={isVehicleModalOpen} onClose={handleVehicleModalClose} onSuccess={handleVehicleCreated} />
    </Box>
  )
}
