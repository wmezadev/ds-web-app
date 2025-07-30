'use client'

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const RegistrationOptionsFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Opciones de Registro
      </Typography>
      <Grid container spacing={2}>
        {/* Category and Office */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>

        {/* Agent and Executive */}
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='executive_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.executive_id}>
                <InputLabel>Ejecutivo</InputLabel>
                <Select {...field} label='Ejecutivo'>
                  <MenuItem value={1}>Ejecutivo 1</MenuItem>
                  <MenuItem value={2}>Ejecutivo 2</MenuItem>
                  <MenuItem value={3}>Ejecutivo 3</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Group and Branch */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_group_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_group_id}>
                <InputLabel>Grupo de Cliente</InputLabel>
                <Select {...field} label='Grupo de Cliente'>
                  <MenuItem value={1}>Grupo 1</MenuItem>
                  <MenuItem value={2}>Grupo 2</MenuItem>
                  <MenuItem value={3}>Grupo 3</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_branch_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_branch_id}>
                <InputLabel>Sucursal de Cliente</InputLabel>
                <Select {...field} label='Sucursal de Cliente'>
                  <MenuItem value={1}>Sucursal 1</MenuItem>
                  <MenuItem value={2}>Sucursal 2</MenuItem>
                  <MenuItem value={3}>Sucursal 3</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
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
        </Grid>

        {/* Readonly fields */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='updated_at'
            control={control}
            render={({ field }) => <TextField {...field} label='Actualizado en' fullWidth disabled />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='is_deleted'
            control={control}
            render={({ field }) => <TextField {...field} label='¿Eliminado?' fullWidth disabled />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='deleted_at'
            control={control}
            render={({ field }) => <TextField {...field} label='Eliminado en' fullWidth disabled />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='created_by'
            control={control}
            render={({ field }) => <TextField {...field} label='Creado por' fullWidth disabled />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='updated_by'
            control={control}
            render={({ field }) => <TextField {...field} label='Actualizado por' fullWidth disabled />}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegistrationOptionsFields
