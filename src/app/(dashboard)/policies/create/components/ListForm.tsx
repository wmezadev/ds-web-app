'use client'

import { useState } from 'react'

import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import { useFieldArray, Controller, Control, FieldErrors } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

interface DependentsFormProps {
  control: Control<PolicyFormInputs>
  errors: FieldErrors<PolicyFormInputs>
}

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
]

const RELATIONSHIP_OPTIONS = ['Cónyuge', 'Hijo/a', 'Padre', 'Madre', 'Hermano/a', 'Abuelo/a', 'Nieto/a', 'Otro']

const DependentsForm = ({ control, errors }: DependentsFormProps) => {
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents'
  })

  const handleAddDependent = () => {
    append({
      full_name: '',
      gender: '',
      birth_date: '',
      national_id: '',
      relationship: '',
      current_premium: ''
    })
  }

  const handleDeleteDependent = (index: number) => {
    remove(index)
    setDeleteMessage('Dependiente eliminado')
    setTimeout(() => setDeleteMessage(null), 2000)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Carga Familiar</Typography>
        <Button variant='outlined' onClick={handleAddDependent} startIcon={<Add />} size='small'>
          Agregar Dependiente
        </Button>
      </Stack>

      {deleteMessage && (
        <Alert severity='info' sx={{ mb: 2 }}>
          {deleteMessage}
        </Alert>
      )}

      {fields.length === 0 ? (
        <Typography variant='body2' color='text.secondary' sx={{ p: 2, textAlign: 'center' }}>
          No hay dependientes añadidos. Haz clic en "Agregar Dependiente" para comenzar.
        </Typography>
      ) : (
        fields.map((field, index) => (
          <Box
            key={field.id}
            mb={3}
            p={2}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2, position: 'relative', backgroundColor: '#fafafa' }}
          >
            <IconButton
              aria-label='Eliminar dependiente'
              onClick={() => handleDeleteDependent(index)}
              size='small'
              sx={{ position: 'absolute', top: 8, right: 8 }}
              color='error'
            >
              <Close fontSize='small' />
            </IconButton>

            <Typography variant='subtitle2' color='primary' sx={{ mb: 2, fontWeight: 600 }}>
              Dependiente #{index + 1}
            </Typography>

            <Grid container spacing={2}>
              {/* Nombre Completo */}
              <Grid item xs={12} md={6}>
                <Controller
                  name={`dependents.${index}.full_name`}
                  control={control}
                  rules={{ required: 'El nombre completo es requerido' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Nombre Completo'
                      placeholder='Ej: Juan Pérez'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              {/* Género */}
              <Grid item xs={12} md={3}>
                <Controller
                  name={`dependents.${index}.gender`}
                  control={control}
                  rules={{ required: 'El género es requerido' }}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Género</InputLabel>
                      <Select {...field} label='Género'>
                        <MenuItem value=''>
                          <em>Seleccionar</em>
                        </MenuItem>
                        {GENDER_OPTIONS.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Fecha de Nacimiento */}
              <Grid item xs={12} md={3}>
                <Controller
                  name={`dependents.${index}.birth_date`}
                  control={control}
                  rules={{ required: 'La fecha de nacimiento es requerida' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type='date'
                      label='Fecha de Nacimiento'
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              {/* Cédula/ID */}
              <Grid item xs={12} md={4}>
                <Controller
                  name={`dependents.${index}.national_id`}
                  control={control}
                  rules={{
                    required: 'La cédula es requerida',
                    pattern: {
                      value: /^[VEJPvejp]-?\d{6,9}$/,
                      message: 'Formato inválido (Ej: V-12345678)'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Cédula/ID'
                      placeholder='Ej: V-12345678'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              {/* Parentesco */}
              <Grid item xs={12} md={4}>
                <Controller
                  name={`dependents.${index}.relationship`}
                  control={control}
                  rules={{ required: 'El parentesco es requerido' }}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Parentesco</InputLabel>
                      <Select {...field} label='Parentesco'>
                        <MenuItem value=''>
                          <em>Seleccionar</em>
                        </MenuItem>
                        {RELATIONSHIP_OPTIONS.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Prima Actual */}
              <Grid item xs={12} md={4}>
                <Controller
                  name={`dependents.${index}.current_premium`}
                  control={control}
                  rules={{
                    required: 'La prima actual es requerida',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Debe ser un número válido (Ej: 100.00)'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Prima Actual'
                      placeholder='50.00'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      type='text'
                      inputMode='decimal'
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      )}
    </Box>
  )
}

export default DependentsForm
