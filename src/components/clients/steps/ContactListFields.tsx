'use client'

import { Box, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const ContactListFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Controller
        name='email_2'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Correo Electrónico 2 (Opcional)'
            fullWidth
            error={!!errors.email_2}
            helperText={errors.email_2?.message}
          />
        )}
      />
      <Controller
        name='mobile_2'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Teléfono Móvil 2 (Opcional)'
            fullWidth
            error={!!errors.mobile_2}
            helperText={errors.mobile_2?.message}
          />
        )}
      />
      <Controller
        name='phone'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Teléfono Fijo (Opcional)'
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        )}
      />
    </Box>
  )
}

export default ContactListFields
