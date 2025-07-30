'use client'

import { Box, Button, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { CloudUpload } from '@mui/icons-material'

import type { ClientFormFields } from '../ClientForm'

const DocumentFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6' gutterBottom>
        Documentos del Cliente
      </Typography>
      <Controller
        name='doc'
        control={control}
        render={({ field: { onChange, value } }) => (
          <Box>
            <input
              accept='image/*,.pdf,.doc,.docx'
              style={{ display: 'none' }}
              id='document-upload'
              type='file'
              onChange={e => {
                const file = e.target.files?.[0] || null

                onChange(file)
              }}
            />
            <label htmlFor='document-upload'>
              <Button variant='outlined' component='span' startIcon={<CloudUpload />} fullWidth>
                Subir Documento
              </Button>
            </label>
            {value && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                Archivo seleccionado: {(value as File).name}
              </Typography>
            )}
            {errors.doc && (
              <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                {errors.doc.message}
              </Typography>
            )}
          </Box>
        )}
      />
    </Box>
  )
}

export default DocumentFields
