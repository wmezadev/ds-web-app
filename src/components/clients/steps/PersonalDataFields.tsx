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
        name='personal_data.gender'
        control={control}
        rules={{ required: mode === 'create' ? 'El género es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Género'
            fullWidth
            error={!!errors.personal_data?.gender}
            helperText={errors.personal_data?.gender?.message}
          />
        )}
      />
      <Controller
        name='personal_data.civil_status'
        control={control}
        rules={{ required: mode === 'create' ? 'El estado civil es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Estado Civil'
            fullWidth
            error={!!errors.personal_data?.civil_status}
            helperText={errors.personal_data?.civil_status?.message}
          />
        )}
      />
      <Controller
        name='personal_data.height'
        control={control}
        rules={{ required: mode === 'create' ? 'La altura es requerida' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Altura'
            type='number'
            fullWidth
            error={!!errors.personal_data?.height}
            helperText={errors.personal_data?.height?.message}
          />
        )}
      />
      <Controller
        name='personal_data.weight'
        control={control}
        rules={{ required: mode === 'create' ? 'El peso es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Peso'
            type='number'
            fullWidth
            error={!!errors.personal_data?.weight}
            helperText={errors.personal_data?.weight?.message}
          />
        )}
      />
      <Controller
        name='personal_data.smoker'
        control={control}
        rules={{ required: mode === 'create' ? 'El fumador es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Fumador'
            fullWidth
            error={!!errors.personal_data?.smoker}
            helperText={errors.personal_data?.smoker?.message}
          />
        )}
      />
      <Controller
        name='personal_data.sports'
        control={control}
        rules={{ required: mode === 'create' ? 'El deporte es requerido' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Deporte'
            fullWidth
            error={!!errors.personal_data?.sports}
            helperText={errors.personal_data?.sports?.message}
          />
        )}
      />
      <Controller
        name='personal_data.profession_id'
        control={control}
        rules={{ required: mode === 'create' ? 'La profesión es requerida' : false }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Profesión'
            fullWidth
            error={!!errors.personal_data?.profession_id}
            helperText={errors.personal_data?.profession_id?.message}
          />
        )}
      />
    </Box>
  )
}

export default PersonalDataFields
