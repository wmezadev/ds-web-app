'use client'

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const RegistrationOptionsFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6' gutterBottom>
        Opciones de Registro
      </Typography>
      <Controller
        name='client_category_id'
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.client_category_id}>
            <InputLabel>Categoría de Cliente</InputLabel>
            <Select {...field} label='Categoría de Cliente'>
              <MenuItem value={1}>Premium</MenuItem>
              <MenuItem value={2}>Estándar</MenuItem>
              <MenuItem value={3}>Básico</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name='office_id'
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.office_id}>
            <InputLabel>Oficina</InputLabel>
            <Select {...field} label='Oficina'>
              <MenuItem value={1}>Oficina Central</MenuItem>
              <MenuItem value={2}>Sucursal Norte</MenuItem>
              <MenuItem value={3}>Sucursal Sur</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name='agent_id'
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.agent_id}>
            <InputLabel>Agente</InputLabel>
            <Select {...field} label='Agente'>
              <MenuItem value={1}>Agente 1</MenuItem>
              <MenuItem value={2}>Agente 2</MenuItem>
              <MenuItem value={3}>Agente 3</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name='notes'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label='Notas (Opcional)'
            multiline
            rows={3}
            fullWidth
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        )}
      />
    </Box>
  )
}

export default RegistrationOptionsFields
