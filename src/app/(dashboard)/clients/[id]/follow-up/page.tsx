'use client'

import React, { useState } from 'react'

import { useParams } from 'next/navigation'

import { Box, Typography, Paper, CircularProgress, TextField, Button, Stack, Grid, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Divider, Chip, Avatar } from '@mui/material'

import { useForm, Controller } from 'react-hook-form'
import { useClient } from '@/hooks/useClient'
import { useCatalogs } from '@/hooks/useCatalogs'
import { useFollowUpTypes } from '@/hooks/useFollowUpTypes'

interface FollowUpFormData {
  currentDate: string
  nextFollowUpDate: string
  subject: string
  description: string
  assignedBy: string | number
  assignedTo: string | number
  gestion: string | number
}

interface FollowUpRecord extends FollowUpFormData {
  id: string
  createdAt: Date
  assignedByName: string
  assignedToName: string
  gestionName: string
}

const ClientFollowUpPage = () => {
  const params = useParams()
  const clientId = params.id as string
  const { data: client, isLoading, error } = useClient(clientId)
  const { catalogs, loading: loadingCatalogs } = useCatalogs()
  const { followUpTypes, loading: loadingFollowUpTypes } = useFollowUpTypes()
  
  // Local state for follow-up records
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([])
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FollowUpFormData>({
    defaultValues: {
      currentDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      nextFollowUpDate: '',
      subject: '',
      description: '',
      assignedBy: '',
      assignedTo: '',
      gestion: ''
    }
  })

  const onSubmit = (data: FollowUpFormData) => {
    // Find agent, executive and gestión names
    const assignedByName = catalogs?.agents.find(agent => agent.id === data.assignedBy)?.name || ''
    const assignedToName = catalogs?.executives.find(executive => executive.id === data.assignedTo)?.name || ''
    const gestionName = followUpTypes.find(type => type.id === data.gestion)?.name || ''
    
    // Create new follow-up record
    const newRecord: FollowUpRecord = {
      ...data,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date(),
      assignedByName,
      assignedToName,
      gestionName
    }
    
    // Add to records list
    setFollowUpRecords(prev => [newRecord, ...prev]) // Add to beginning for chronological order
    
    // Reset form
    reset({
      currentDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: '',
      subject: '',
      description: '',
      assignedBy: '',
      assignedTo: '',
      gestion: ''
    })
    
    console.log('Seguimiento guardado:', newRecord)
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

                {/* Gestión - Tipo de Seguimiento */}
                

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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <Controller
                    name="gestion"
                    control={control}
                    rules={{ required: 'El tipo de gestión es requerido' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.gestion}>
                        <InputLabel>Tipo de Gestión</InputLabel>
                        <Select 
                          {...field} 
                          label="Tipo de Gestión" 
                          value={field.value ?? ''} 
                          disabled={loadingFollowUpTypes}
                        >
                          <MenuItem value="">
                            <em>Seleccionar tipo de gestión</em>
                          </MenuItem>
                          {followUpTypes.map(type => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {loadingFollowUpTypes && (
                          <Typography variant="caption" color="textSecondary">
                            Cargando tipos de gestión...
                          </Typography>
                        )}
                        {errors.gestion && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {errors.gestion.message}
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
          
          {followUpRecords.length === 0 ? (
            <Typography variant='body1' color='text.secondary'>
              No hay seguimientos registrados para este cliente.
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {followUpRecords.map((record, index) => (
                <React.Fragment key={record.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 2,
                      px: 0
                    }}
                  >
                    {/* Header with date, subject and assignment info */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      width: '100%',
                      mb: 1
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {record.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip 
                            label={`Fecha: ${new Date(record.currentDate).toLocaleDateString('es-ES')}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          <Chip 
                            label={`Próximo: ${new Date(record.nextFollowUpDate).toLocaleDateString('es-ES')}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                          <Chip 
                            label={`Gestión: ${record.gestionName}`}
                            size="small"
                            variant="filled"
                            color="info"
                          />
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2, minWidth: 'fit-content' }}>
                        {record.createdAt.toLocaleString('es-ES')}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
                        Descripción:
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'grey.50',
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                          {record.description}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Assignment info */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {record.assignedByName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Asignado por:</strong> {record.assignedByName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                          {record.assignedToName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Asignado a:</strong> {record.assignedToName}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < followUpRecords.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Stack>
    </Box>
  )
}

export default ClientFollowUpPage
