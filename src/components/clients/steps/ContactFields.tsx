'use client'

import { Box, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

interface Props {
  mode?: 'create' | 'edit'
}

const ContactFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Controller
        name='email_1'
        control={control}
        rules={{
          required: mode === 'create' ? 'El correo electrónico es requerido' : false,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo electrónico inválido'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Correo Electrónico 1'
            fullWidth
            error={!!errors.email_1}
            helperText={errors.email_1?.message}
          />
        )}
      />
      <Controller
        name='mobile_1'
        control={control}
        rules={{
          required: mode === 'create' ? 'El teléfono móvil es requerido' : false,
          pattern: {
            value: /^[0-9+\-\s()]+$/,
            message: 'Número de teléfono inválido'
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Teléfono Móvil 1'
            fullWidth
            error={!!errors.mobile_1}
            helperText={errors.mobile_1?.message}
          />
        )}
      />
    </Box>
  )
}

export default ContactFields
