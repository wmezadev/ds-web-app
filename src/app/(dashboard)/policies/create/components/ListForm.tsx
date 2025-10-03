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
import { useFieldArray, Controller, type Control } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

type FormType = 'dependents' | 'beneficiaries'

interface ListFormProps {
  control: Control<PolicyFormInputs>
  type: FormType
}

interface FormConfig {
  title: string
  addButtonLabel: string
  itemLabel: string
  emptyMessage: string
  deleteMessage: string
  fieldName: 'dependents' | 'beneficiaries'
  lastFieldConfig: {
    name: string
    label: string
    placeholder: string
    prefix?: string
    suffix?: string
    pattern: RegExp
    errorMessage: string
  }
}

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
]

const RELATIONSHIP_OPTIONS = ['Cónyuge', 'Hijo/a', 'Padre', 'Madre', 'Hermano/a', 'Abuelo/a', 'Nieto/a', 'Otro']

const FORM_CONFIGS: Record<FormType, FormConfig> = {
  dependents: {
    title: 'Carga Familiar',
    addButtonLabel: 'Agregar Dependiente',
    itemLabel: 'Dependiente',
    emptyMessage: 'No hay dependientes añadidos. Haz clic en "Agregar Dependiente" para comenzar.',
    deleteMessage: 'Dependiente eliminado',
    fieldName: 'dependents',
    lastFieldConfig: {
      name: 'current_premium',
      label: 'Prima Actual',
      placeholder: '50.00',
      prefix: '$',
      pattern: /^\d+(\.\d{1,2})?$/,
      errorMessage: 'Debe ser un número válido (Ej: 100.00)'
    }
  },
  beneficiaries: {
    title: 'Beneficiarios en Caso de Fallecimiento',
    addButtonLabel: 'Agregar Beneficiario',
    itemLabel: 'Beneficiario',
    emptyMessage: 'No hay beneficiarios añadidos. Haz clic en "Agregar Beneficiario" para comenzar.',
    deleteMessage: 'Beneficiario eliminado',
    fieldName: 'beneficiaries',
    lastFieldConfig: {
      name: 'percentage',
      label: 'Porcentaje',
      placeholder: '25',
      suffix: '%',
      pattern: /^(100|[1-9]?\d)$/,
      errorMessage: 'Debe ser un número entre 0 y 100'
    }
  }
}

const ListForm = ({ control, type }: ListFormProps) => {
  const config = FORM_CONFIGS[type]
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: config.fieldName
  })

  const handleAddItem = () => {
    const newItem: any = {
      full_name: '',
      gender: '',
      birth_date: '',
      national_id: '',
      relationship: ''
    }

    newItem[config.lastFieldConfig.name] = ''
    append(newItem)
  }

  const handleDeleteItem = (index: number) => {
    remove(index)
    setDeleteMessage(config.deleteMessage)
    setTimeout(() => setDeleteMessage(null), 2000)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>{config.title}</Typography>
        <Button variant='outlined' onClick={handleAddItem} startIcon={<Add />} size='small'>
          {config.addButtonLabel}
        </Button>
      </Stack>

      {deleteMessage && (
        <Alert severity='info' sx={{ mb: 2 }}>
          {deleteMessage}
        </Alert>
      )}

      {fields.length === 0 ? (
        <Typography variant='body2' color='text.secondary' sx={{ p: 2, textAlign: 'center' }}>
          {config.emptyMessage}
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
              aria-label={`Eliminar ${config.itemLabel.toLowerCase()}`}
              onClick={() => handleDeleteItem(index)}
              size='small'
              sx={{ position: 'absolute', top: 8, right: 8 }}
              color='error'
            >
              <Close fontSize='small' />
            </IconButton>

            <Typography variant='subtitle2' color='primary' sx={{ mb: 2, fontWeight: 600 }}>
              {config.itemLabel} #{index + 1}
            </Typography>

            <Grid container spacing={2}>
              {/* Nombre Completo */}
              <Grid item xs={12} md={6}>
                <Controller
                  name={`${config.fieldName}.${index}.full_name` as any}
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
                  name={`${config.fieldName}.${index}.gender` as any}
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
                  name={`${config.fieldName}.${index}.birth_date` as any}
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
                  name={`${config.fieldName}.${index}.national_id` as any}
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
                  name={`${config.fieldName}.${index}.relationship` as any}
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

              {/* Campo dinámico (Prima Actual o Porcentaje) */}
              <Grid item xs={12} md={4}>
                <Controller
                  name={`${config.fieldName}.${index}.${config.lastFieldConfig.name}` as any}
                  control={control}
                  rules={{
                    required: `${config.lastFieldConfig.label} es requerido`,
                    pattern: {
                      value: config.lastFieldConfig.pattern,
                      message: config.lastFieldConfig.errorMessage
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={config.lastFieldConfig.label}
                      placeholder={config.lastFieldConfig.placeholder}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      type='text'
                      inputMode='decimal'
                      InputProps={{
                        startAdornment: config.lastFieldConfig.prefix ? (
                          <Typography sx={{ mr: 1 }}>{config.lastFieldConfig.prefix}</Typography>
                        ) : undefined,
                        endAdornment: config.lastFieldConfig.suffix ? (
                          <Typography sx={{ ml: 1 }}>{config.lastFieldConfig.suffix}</Typography>
                        ) : undefined
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

export default ListForm
