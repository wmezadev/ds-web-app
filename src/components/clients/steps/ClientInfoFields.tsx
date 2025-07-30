'use client'

import React from 'react'

import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

interface Props {
  mode?: 'create' | 'edit'
}

const ClientInfoFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Controller
        name='document_number'
        control={control}
        rules={{
          required: mode === 'create' ? 'El número de documento es requerido' : false
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label='Número de Documento'
            error={!!errors.document_number}
            helperText={errors.document_number?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name='client_type'
        control={control}
        rules={{
          required: mode === 'create' ? 'El tipo de cliente es requerido' : false
        }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.client_type}>
            <InputLabel>Tipo de Cliente</InputLabel>
            <Select {...field} label='Tipo de Cliente'>
              <MenuItem value='V'>Persona Natural</MenuItem>
              <MenuItem value='J'>Persona Jurídica</MenuItem>
            </Select>
          </FormControl>
        )}
      />
    </Box>
  )
}

export default ClientInfoFields
