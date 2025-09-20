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
  RadioGroup
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from '@/hooks/useSnackbar'

interface VehicleFormData {
  license_plate: string
  brand_id: string
  model_id: string
  version_id: string
  year: number | string
  circulation_city_id: string
  color: string
  has_gps: boolean
}

interface VehicleModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (vehicleData: VehicleFormData) => void
}

const VehicleModal = ({ open, onClose, onSuccess }: VehicleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccess, showError } = useSnackbar()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<VehicleFormData>({
    defaultValues: {
      license_plate: '',
      brand_id: '',
      model_id: '',
      version_id: '',
      year: '',
      circulation_city_id: '',
      color: '',
      has_gps: false
    }
  })

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
                  <TextField
                    {...field}
                    label='Color'
                    fullWidth
                    variant='outlined'
                    error={!!errors.color}
                    helperText={errors.color?.message}
                    placeholder='Ej: Blanco, Negro, Azul'
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
                  <FormControl fullWidth error={!!errors.brand_id}>
                    <InputLabel>Marca</InputLabel>
                    <Select {...field} label='Marca' value={field.value ?? ''}>
                      <MenuItem value=''>
                        <em>Seleccionar marca</em>
                      </MenuItem>
                      {/* TODO: Cargar marcas desde la API */}
                    </Select>
                    {errors.brand_id && (
                      <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.brand_id.message}
                      </Typography>
                    )}
                  </FormControl>
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
                  <FormControl fullWidth error={!!errors.model_id}>
                    <InputLabel>Modelo</InputLabel>
                    <Select {...field} label='Modelo' value={field.value ?? ''}>
                      <MenuItem value=''>
                        <em>Seleccionar modelo</em>
                      </MenuItem>
                      {/* TODO: Cargar modelos basados en la marca seleccionada */}
                    </Select>
                    {errors.model_id && (
                      <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.model_id.message}
                      </Typography>
                    )}
                  </FormControl>
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
                  <FormControl fullWidth error={!!errors.version_id}>
                    <InputLabel>Versión</InputLabel>
                    <Select {...field} label='Versión' value={field.value ?? ''}>
                      <MenuItem value=''>
                        <em>Seleccionar versión</em>
                      </MenuItem>
                      {/* TODO: Cargar versiones basadas en el modelo seleccionado */}
                    </Select>
                    {errors.version_id && (
                      <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.version_id.message}
                      </Typography>
                    )}
                  </FormControl>
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
