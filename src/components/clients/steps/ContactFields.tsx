'use client'

import { Box, TextField, Grid } from '@mui/material'
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
    <Box>
      <Grid container spacing={2}>
        {/* Email 1 and Email 2 */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>

        {/* Mobile 1 and Mobile 2 */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>

        {/* Phone and Reference */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='reference'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Referencia (Opcional)'
                fullWidth
                error={!!errors.reference}
                helperText={errors.reference?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ContactFields
