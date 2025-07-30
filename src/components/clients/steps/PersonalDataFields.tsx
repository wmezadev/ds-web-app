'use client'

import { Box, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

interface Props {
  mode?: 'create' | 'edit'
}

const PersonalDataFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Controller
        name='birth_date'
        control={control}
        rules={{
          required: mode === 'create' ? 'La fecha de nacimiento es requerida' : false,
          validate: value => {
            if (!value) return mode === 'create' ? 'La fecha de nacimiento es requerida' : true
            const date = new Date(value)
            const today = new Date()

            if (date > today) return 'La fecha de nacimiento no puede ser futura'

            return true
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Fecha de Nacimiento'
            type='date'
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.birth_date}
            helperText={errors.birth_date?.message}
          />
        )}
      />
      <Controller
        name='birth_place'
        control={control}
        rules={{ required: mode === 'create' ? 'El lugar de nacimiento es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Lugar de Nacimiento'
            fullWidth
            error={!!errors.birth_place}
            helperText={errors.birth_place?.message}
          />
        )}
      />
      <Controller
        name='first_name'
        control={control}
        rules={{ required: mode === 'create' ? 'El nombre es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Nombre'
            fullWidth
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
        )}
      />
      <Controller
        name='last_name'
        control={control}
        rules={{ required: mode === 'create' ? 'El apellido es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Apellido'
            fullWidth
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
        )}
      />
    </Box>
  )
}

export default PersonalDataFields
