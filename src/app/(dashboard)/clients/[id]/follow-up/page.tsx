'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { Box, Typography, Paper, CircularProgress, TextField, Button, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import { useForm, Controller } from 'react-hook-form'
import { useClient } from '@/hooks/useClient'
import { useCatalogs } from '@/hooks/useCatalogs'

interface FollowUpFormData {
  currentDate: string
  nextFollowUpDate: string
  subject: string
  description: string
  assignedBy: string | number
  assignedTo: string | number
}

const ClientFollowUpPage = () => {
  const params = useParams()
  const clientId = params.id as string
  const { data: client, isLoading, error } = useClient(clientId)
  const { catalogs, loading: loadingCatalogs } = useCatalogs()
  
  const { control, handleSubmit, formState: { errors } } = useForm<FollowUpFormData>({
    defaultValues: {
      currentDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      nextFollowUpDate: '',
      subject: '',
      description: '',
      assignedBy: '',
      assignedTo: ''
    }
  })

  const onSubmit = (data: FollowUpFormData) => {
    console.log('Datos del seguimiento:', {
      ...data,
      clientId
    })
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant='h6' color='error'>
          Error al cargar el cliente
        </Typography>
      </Box>
    )
  }

  const clientName = client?.person_type === 'N' 
    ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
    : client?.first_name || ''

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
  Seguimiento del Cliente{' '}
  <Box
    component="span"
    sx={{ color: 'primary.main', fontWeight: 700 }}
  >
    {clientName}
  </Box>
</Typography>


      <Stack spacing={3}>
        {/* Formulario de Nuevo Seguimiento */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Nuevo Seguimiento
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Fecha Actual - Solo lectura */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="currentDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Fecha Actual"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      disabled
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              {/* Próximo Seguimiento - Editable */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="nextFollowUpDate"
                  control={control}
                  rules={{ required: 'La fecha de próximo seguimiento es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Próximo Seguimiento"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.nextFollowUpDate}
                      helperText={errors.nextFollowUpDate?.message}
                      variant="outlined"
                      inputProps={{
                        min: new Date().toISOString().split('T')[0] // Minimum date is today
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: 'El asunto es requerido' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Asunto"
                        fullWidth
                        variant="outlined"
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                        placeholder="Describe el asunto del seguimiento..."
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'La descripción es requerida' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Descripción"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Describe el seguimiento..."
                      />
                    )}
                  />
                </Grid>

                {/* Asignado Por - Agentes */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="assignedBy"
                    control={control}
                    rules={{ required: 'El campo "Asignado por" es requerido' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.assignedBy}>
                        <InputLabel>Asignado por (Agente)</InputLabel>
                        <Select 
                          {...field} 
                          label="Asignado por (Agente)" 
                          value={field.value ?? ''} 
                          disabled={loadingCatalogs}
                        >
                          <MenuItem value="">
                            <em>Seleccionar agente</em>
                          </MenuItem>
                          {catalogs?.agents.map(agent => (
                            <MenuItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingCatalogs && (
                          <Typography variant="caption" color="textSecondary">
                            Cargando agentes...
                          </Typography>
                        )}
                        {errors.assignedBy && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {errors.assignedBy.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Asignado A - Ejecutivos */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="assignedTo"
                    control={control}
                    rules={{ required: 'El campo "Asignado a" es requerido' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.assignedTo}>
                        <InputLabel>Asignado a (Ejecutivo)</InputLabel>
                        <Select 
                          {...field} 
                          label="Asignado a (Ejecutivo)" 
                          value={field.value ?? ''} 
                          disabled={loadingCatalogs}
                        >
                          <MenuItem value="">
                            <em>Seleccionar ejecutivo</em>
                          </MenuItem>
                          {catalogs?.executives.map(executive => (
                            <MenuItem key={executive.id} value={executive.id}>
                              {executive.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingCatalogs && (
                          <Typography variant="caption" color="textSecondary">
                            Cargando ejecutivos...
                          </Typography>
                        )}
                        {errors.assignedTo && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {errors.assignedTo.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Botón Guardar */}
                <Grid item xs={12} container justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Guardar Seguimiento
                  </Button>
                </Grid>
              </Grid>
            </Box>
        </Paper>

        {/* Historial de Seguimiento */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Historial de Seguimiento
          </Typography>
          
          <Typography variant='body1' color='text.secondary'>
            Aquí se mostrará el historial de seguimiento del cliente.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  )
}

export default ClientFollowUpPage
