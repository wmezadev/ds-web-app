'use client'

import { Box, TextField, Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

interface Props {
  mode?: 'create' | 'edit'
}

const LegalDataFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='legal_representative'
            control={control}
            rules={{ required: mode === 'create' ? 'El representante legal es requerido' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Representante Legal'
                fullWidth
                error={!!errors.legal_representative}
                helperText={errors.legal_representative?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='economic_activity_id'
            control={control}
            rules={{ required: mode === 'create' ? 'La actividad económica es requerida' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Actividad Económica'
                fullWidth
                error={!!errors.economic_activity_id}
                helperText={errors.economic_activity_id?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default LegalDataFields
