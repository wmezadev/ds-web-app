'use client'

import React, { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  Divider,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material'

import { useForm, Controller } from 'react-hook-form'

import { useClient } from '@/hooks/useClient'
import RichTextEditorComponent from '@/@core/components/rich-text-editor/RichTextEditor'
import { useApi } from '@/hooks/useApi'

interface FollowUpFormData {
  currentDate: string
  nextFollowUpDate: string
  subject: string
  description: string
  assignedBy: string | number
  assignedTo: string | number
  gestion: string | number
}

interface BasicUser {
  id: number
  username: string
  full_name: string
}

const UserFollowUpPage = () => {
  const { fetchApi } = useApi()

  const params = useParams()
  const userId = params.id as string

  const {
    data: client,
    followUpTypes,
    followUpRecords,
    isLoading,
    error,
    createFollowUp,
    updateFollowUpStatus
  } = useClient(userId)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [users, setUsers] = useState<BasicUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true)

        const users = await fetchApi<BasicUser[]>('users')

        setUsers(users)
      } catch (err: any) {
        console.error('Error loading users:', err)
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        })
        setUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [fetchApi])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FollowUpFormData>({
    defaultValues: {
      currentDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: '',
      subject: '',
      description: '',
      assignedBy: '',
      assignedTo: '',
      gestion: ''
    }
  })

  const onSubmit = async (data: FollowUpFormData) => {
    try {
      setIsSubmitting(true)

      const followUpData = {
        subject: data.subject,
        reminder_date: data.nextFollowUpDate,
        description: data.description,
        assigned_to: Number(data.assignedTo),
        assigned_by: Number(data.assignedBy),
        type_id: Number(data.gestion),
        status: true
      }

      await createFollowUp(followUpData)

      setSnackbar({ open: true, message: 'Seguimiento creado con éxito', severity: 'success' })

      reset({
        currentDate: new Date().toISOString().split('T')[0],
        nextFollowUpDate: '',
        subject: '',
        description: '',
        assignedBy: '',
        assignedTo: '',
        gestion: ''
      })
    } catch (err: any) {
      setSnackbar({ open: true, message: 'Error al crear el seguimiento', severity: 'error' })
      console.error('Error creating follow-up:', err)
    } finally {
      setIsSubmitting(false)
    }
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

  const userName =
    client?.person_type === 'N'
      ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
      : client?.first_name || ''

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        Seguimiento del Usuario{' '}
        <Box component='span' sx={{ color: 'primary.main', fontWeight: 700 }}>
          {userName}
        </Box>
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 3 }}>
            Nuevo Seguimiento
          </Typography>

          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name='currentDate'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Fecha Actual'
                      type='date'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      disabled
                      variant='outlined'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name='nextFollowUpDate'
                  control={control}
                  rules={{ required: 'La fecha de próximo seguimiento es requerida' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Próximo Seguimiento'
                      type='date'
                      fullWidth
                      slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: {
                          min: new Date().toISOString().split('T')[0]
                        }
                      }}
                      error={!!errors.nextFollowUpDate}
                      helperText={errors.nextFollowUpDate?.message}
                      variant='outlined'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='subject'
                  control={control}
                  rules={{ required: 'El asunto es requerido' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Asunto'
                      fullWidth
                      variant='outlined'
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      placeholder='Describe el asunto del seguimiento...'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  Descripción
                </Typography>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: 'La descripción es requerida' }}
                  render={({ field, fieldState }) => (
                    <>
                      <RichTextEditorComponent name={field.name} control={control} />
                      {fieldState.error && (
                        <Typography color='error' variant='caption' sx={{ mt: 1, display: 'block' }}>
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name='assignedBy'
                  control={control}
                  rules={{ required: 'El campo "Asignado por" es requerido' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.assignedBy}>
                      <InputLabel>Asignado por</InputLabel>
                      <Select {...field} label='Asignado por' value={field.value ?? ''} disabled={loadingUsers}>
                        <MenuItem value=''>
                          <em>Seleccionar usuario</em>
                        </MenuItem>
                        {users.map(user => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {loadingUsers && (
                        <Typography variant='caption' color='textSecondary'>
                          Cargando agentes...
                        </Typography>
                      )}
                      {errors.assignedBy && (
                        <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                          {errors.assignedBy.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name='assignedTo'
                  control={control}
                  rules={{ required: 'El campo "Asignado a" es requerido' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.assignedTo}>
                      <InputLabel>Asignado a</InputLabel>
                      <Select {...field} label='Asignado a' value={field.value ?? ''} disabled={loadingUsers}>
                        <MenuItem value=''>
                          <em>Seleccionar usuario</em>
                        </MenuItem>
                        {users.map(user => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {loadingUsers && (
                        <Typography variant='caption' color='textSecondary'>
                          Cargando ejecutivos...
                        </Typography>
                      )}
                      {errors.assignedTo && (
                        <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                          {errors.assignedTo.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name='gestion'
                  control={control}
                  rules={{ required: 'El tipo de gestión es requerido' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gestion}>
                      <InputLabel>Tipo de Gestión</InputLabel>
                      <Select {...field} label='Tipo de Gestión' value={field.value ?? ''} disabled={isLoading}>
                        <MenuItem value=''>
                          <em>Seleccionar tipo de gestión</em>
                        </MenuItem>
                        {followUpTypes.map(type => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {isLoading && (
                        <Typography variant='caption' color='textSecondary'>
                          Cargando tipos de gestión...
                        </Typography>
                      )}
                      {errors.gestion && (
                        <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.75 }}>
                          {errors.gestion.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} container justifyContent='flex-end'>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  sx={{ mt: 2 }}
                  disabled={isSubmitting || isLoading}
                  startIcon={<i className='ri-save-line' />}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Historial de Seguimiento
          </Typography>

          {followUpRecords.length === 0 ? (
            <Typography variant='body1' color='text.secondary'>
              No hay seguimientos registrados para este usuario.
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {followUpRecords.map((record, index) => {
                const assignedByName =
                  users.find(user => user.id === record.assigned_by)?.full_name ||
                  record.assigned_by_name ||
                  'Usuario desconocido'

                const assignedToName =
                  users.find(user => user.id === record.assigned_to)?.full_name ||
                  record.assigned_to_name ||
                  'Usuario desconocido'

                const typeName =
                  followUpTypes.find(type => type.id === record.type_id)?.name || record.type_name || 'Tipo desconocido'

                const createdDate = record.created_at ? new Date(record.created_at) : new Date()

                return (
                  <React.Fragment key={record.id}>
                    <ListItem
                      alignItems='flex-start'
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        py: 2,
                        px: 0
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          width: '100%',
                          mb: 1
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant='h6' component='div' sx={{ fontWeight: 600, mb: 0.5 }}>
                            {record.subject}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={record.status}
                                  onChange={async e => {
                                    setUpdatingStatus(record.id)

                                    try {
                                      await updateFollowUpStatus(record.id, e.target.checked)
                                      setSnackbar({
                                        open: true,
                                        message: 'Estado actualizado con éxito',
                                        severity: 'success'
                                      })
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: 'Error al actualizar el estado',
                                        severity: 'error'
                                      })
                                    } finally {
                                      setUpdatingStatus(null)
                                    }
                                  }}
                                  disabled={updatingStatus === record.id}
                                />
                              }
                              label={record.status ? 'Activo' : 'Inactivo'}
                            />
                            <Chip
                              label={`Creado: ${createdDate.toLocaleDateString('es-ES')}`}
                              size='small'
                              variant='outlined'
                              color='primary'
                            />
                            <Chip
                              label={`Próximo: ${new Date(record.reminder_date).toLocaleDateString('es-ES')}`}
                              size='small'
                              variant='outlined'
                              color='secondary'
                            />
                            <Chip label={typeName} size='small' variant='filled' color='info' />
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2, width: '100%' }}>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500, mb: 0.5 }}>
                          Descripción:
                        </Typography>
                        <Box
                          sx={{
                            '& p': { m: 0 },
                            '& ul, & ol': { pl: 3, m: 0 },
                            lineHeight: 1.6
                          }}
                          dangerouslySetInnerHTML={{ __html: record.description }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 40, height: 40, fontSize: '1rem', bgcolor: 'primary.main' }}>
                            {assignedByName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant='caption' color='text.secondary'>
                            <strong>Asignado por:</strong> {assignedByName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 40, height: 40, fontSize: '1rem', bgcolor: 'secondary.main' }}>
                            {assignedToName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant='caption' color='text.secondary'>
                            <strong>Asignado a:</strong> {assignedToName}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < followUpRecords.length - 1 && <Divider />}
                  </React.Fragment>
                )
              })}
            </List>
          )}
        </Paper>
      </Stack>
    </Box>
  )
}

export default UserFollowUpPage
