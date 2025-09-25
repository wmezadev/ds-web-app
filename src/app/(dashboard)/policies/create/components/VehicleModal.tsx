'use client'

import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'

import { useBrands } from '@/app/(dashboard)/vehicles/hooks/useBrands'
import { useModels } from '@/app/(dashboard)/vehicles/hooks/useModels'
import { useVersions } from '@/app/(dashboard)/vehicles/hooks/useVersions'

import { useSnackbar } from '@/hooks/useSnackbar'

interface VehicleFormData {
  license_plate: string
  brand_id: number | undefined
  model_id: number | undefined
  version_id: number | undefined
  year: number | undefined
  circulation_city_id: number | undefined
  color: string
  has_gps: boolean
}

interface VehicleModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (vehicleData: VehicleFormData) => void
}

const PREDEFINED_COLORS = [
  'Blanco',
  'Negro',
  'Gris',
  'Plata',
  'Azul',
  'Rojo',
  'Verde',
  'Amarillo',
  'Naranja',
  'Marrón',
  'Beige',
  'Dorado',
  'Violeta',
  'Rosa',
  'Turquesa'
]

const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    Blanco: '#FFFFFF',
    Negro: '#000000',
    Gris: '#808080',
    Plata: '#C0C0C0',
    Azul: '#0000FF',
    Rojo: '#FF0000',
    Verde: '#008000',
    Amarillo: '#FFFF00',
    Naranja: '#FFA500',
    Marrón: '#A52A2A',
    Beige: '#F5F5DC',
    Dorado: '#FFD700',
    Violeta: '#8A2BE2',
    Rosa: '#FFC0CB',
    Turquesa: '#40E0D0'
  }

  return colorMap[colorName] || '#CCCCCC'
}

const VehicleModal = ({ open, onClose, onSuccess }: VehicleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: brands, loading: brandsLoading, error: brandsError, setParams: setBrandParams } = useBrands()
  const { data: models, loading: modelsLoading, error: modelsError, setParams: setModelParams } = useModels()
  const { data: versions, loading: versionsLoading, error: versionsError, setParams: setVersionParams } = useVersions()

  const { showSuccess, showError } = useSnackbar()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<VehicleFormData>({
    defaultValues: {
      license_plate: '',
      brand_id: undefined,
      model_id: undefined,
      version_id: undefined,
      year: undefined,
      circulation_city_id: undefined,
      color: '',
      has_gps: false
    }
  })

  const selectedBrandId = watch('brand_id')
  const selectedModelId = watch('model_id')

  React.useEffect(() => {
    if (selectedBrandId) {
      setModelParams({ brand_id: selectedBrandId })
      setValue('model_id', undefined)
      setValue('version_id', undefined)
    } else {
      setModelParams({})
      setValue('model_id', undefined)
      setValue('version_id', undefined)
    }
  }, [selectedBrandId, setModelParams, setValue])

  React.useEffect(() => {
    if (selectedModelId) {
      setVersionParams({ model_id: selectedModelId })
      setValue('version_id', undefined)
    } else {
      setVersionParams({})
      setValue('version_id', undefined)
    }
  }, [selectedModelId, setVersionParams, setValue])

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true)

      console.log('Vehicle data to save:', data)

      showSuccess('Vehículo creado exitosamente')

      reset()

      if (onSuccess) {
        onSuccess(data)
      }

      onClose()
    } catch (err: any) {
      showError('Error al crear el vehículo')
      console.error('Error creating vehicle:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const currentYear = new Date().getFullYear() + 1
  const yearOptions: number[] = []

  for (let year = currentYear; year >= 1940; year--) {
    yearOptions.push(year)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth aria-labelledby='vehicle-modal-title'>
      <DialogTitle id='vehicle-modal-title'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' component='div'>
            Agregar Nuevo Vehículo
          </Typography>
          <IconButton onClick={handleClose} size='small' aria-label='close'>
            <i className='ri-close-line' />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Placa */}
            <Grid item xs={12} md={6}>
              <Controller
                name='license_plate'
                control={control}
                rules={{
                  required: 'La placa es requerida',
                  minLength: { value: 3, message: 'La placa debe tener al menos 3 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Placa'
                    fullWidth
                    variant='outlined'
                    error={!!errors.license_plate}
                    helperText={errors.license_plate?.message}
                    placeholder='Ej: ABC123'
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    onChange={e => field.onChange(e.target.value.toUpperCase())}
                  />
                )}
              />
            </Grid>

            {/* Color */}
            <Grid item xs={12} md={6}>
              <Controller
                name='color'
                control={control}
                rules={{ required: 'El color es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={PREDEFINED_COLORS}
                    freeSolo
                    value={field.value || ''}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || '')
                    }}
                    onInputChange={(_, newInputValue) => {
                      field.onChange(newInputValue)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Color'
                        variant='outlined'
                        error={!!errors.color}
                        helperText={errors.color?.message || 'Selecciona un color o escribe uno personalizado'}
                        placeholder='Ej: Blanco, Negro, Azul'
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: getColorCode(option),
                            border: '1px solid #ccc',
                            marginRight: 1
                          }}
                        />
                        {option}
                      </Box>
                    )}
                  />
                )}
              />
            </Grid>

            {/* Marca */}
            <Grid item xs={12} md={4}>
              <Controller
                name='brand_id'
                control={control}
                rules={{ required: 'La marca es requerida' }}
                render={({ field }) => (
                  <Autocomplete
                    options={brands || []}
                    loading={brandsLoading}
                    getOptionLabel={option => option.name}
                    value={brands?.find(brand => brand.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.id : undefined)
                    }}
                    onInputChange={(_, newInputValue) => {
                      setBrandParams({ q: newInputValue })
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Marca'
                        error={!!errors.brand_id}
                        helperText={errors.brand_id?.message || brandsError}
                        placeholder='Buscar marca...'
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </Box>
                    )}
                    noOptionsText={brandsLoading ? 'Cargando...' : 'No se encontraron marcas'}
                    loadingText='Buscando marcas...'
                  />
                )}
              />
            </Grid>

            {/* Modelo */}
            <Grid item xs={12} md={4}>
              <Controller
                name='model_id'
                control={control}
                rules={{ required: 'El modelo es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    options={models || []}
                    loading={modelsLoading}
                    disabled={!selectedBrandId}
                    getOptionLabel={option => option.name}
                    value={models?.find(model => model.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.id : undefined)
                    }}
                    onInputChange={(_, newInputValue) => {
                      setModelParams({ q: newInputValue, brand_id: selectedBrandId })
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Modelo'
                        error={!!errors.model_id}
                        helperText={
                          errors.model_id?.message ||
                          modelsError ||
                          (!selectedBrandId ? 'Selecciona una marca primero' : '')
                        }
                        placeholder={selectedBrandId ? 'Buscar modelo...' : 'Selecciona una marca primero'}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </Box>
                    )}
                    noOptionsText={modelsLoading ? 'Cargando...' : 'No se encontraron modelos'}
                    loadingText='Buscando modelos...'
                  />
                )}
              />
            </Grid>

            {/* Versión */}
            <Grid item xs={12} md={4}>
              <Controller
                name='version_id'
                control={control}
                rules={{ required: 'La versión es requerida' }}
                render={({ field }) => (
                  <Autocomplete
                    options={versions || []}
                    loading={versionsLoading}
                    disabled={!selectedModelId}
                    getOptionLabel={option => option.name}
                    value={versions?.find(version => version.id === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.id : undefined)
                    }}
                    onInputChange={(_, newInputValue) => {
                      setVersionParams({ q: newInputValue, model_id: selectedModelId })
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Versión'
                        error={!!errors.version_id}
                        helperText={
                          errors.version_id?.message ||
                          versionsError ||
                          (!selectedModelId ? 'Selecciona un modelo primero' : '')
                        }
                        placeholder={selectedModelId ? 'Buscar versión...' : 'Selecciona un modelo primero'}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        <Typography variant='body1'>{option.name}</Typography>
                      </Box>
                    )}
                    noOptionsText={versionsLoading ? 'Cargando...' : 'No se encontraron versiones'}
                    loadingText='Buscando versiones...'
                  />
                )}
              />
            </Grid>

            {/* Año */}
            <Grid item xs={12} md={6}>
              <Controller
                name='year'
                control={control}
                rules={{
                  required: 'El año es requerido',
                  min: { value: 1940, message: 'El año debe ser mayor a 1940' },
                  max: { value: currentYear, message: `El año no puede ser mayor a ${currentYear}` }
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.year}>
                    <InputLabel>Año</InputLabel>
                    <Select {...field} label='Año' value={field.value ?? ''}>
                      <MenuItem value=''>
                        <em>Seleccionar año</em>
                      </MenuItem>
                      {yearOptions.map(year => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.year && (
                      <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.year.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Lugar de Circulación */}
            <Grid item xs={12} md={6}>
              <Controller
                name='circulation_city_id'
                control={control}
                rules={{ required: 'El lugar de circulación es requerido' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.circulation_city_id}>
                    <InputLabel>Lugar de Circulación</InputLabel>
                    <Select {...field} label='Lugar de Circulación' value={field.value ?? ''}>
                      <MenuItem value=''>
                        <em>Seleccionar ciudad</em>
                      </MenuItem>
                      {/* TODO: Cargar ciudades desde la API */}
                    </Select>
                    {errors.circulation_city_id && (
                      <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.circulation_city_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Sistema Satelital */}
            <Grid item xs={12}>
              <Controller
                name='has_gps'
                control={control}
                render={({ field }) => (
                  <FormControl component='fieldset'>
                    <Typography variant='subtitle1' sx={{ mb: 1 }}>
                      ¿El vehículo posee Sistema Satelital?
                    </Typography>
                    <RadioGroup
                      row
                      {...field}
                      value={field.value ? 'yes' : 'no'}
                      onChange={e => field.onChange(e.target.value === 'yes')}
                    >
                      <FormControlLabel value='yes' control={<Radio />} label='Sí' />
                      <FormControlLabel value='no' control={<Radio />} label='No' />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, mt: 2 }}>
        <Button onClick={handleClose} variant='outlined' disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={isSubmitting}
          startIcon={<i className='ri-save-line' />}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VehicleModal
