'use client'

import React, { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Stack,
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

import { useClient } from '@/hooks/useClient'
import { useApi } from '@/hooks/useApi'
import FollowUpModal from './components/FollowUpModal'
import Link from '@/components/Link'
import { ROUTES } from '@/constants/routes'

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
    updateFollowUpStatus,
    refreshFollowUps
  } = useClient(userId)

  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [users, setUsers] = useState<BasicUser[]>([])
  const [modalOpen, setModalOpen] = useState(false)

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
        const users = await fetchApi<BasicUser[]>('users')

        setUsers(users)
      } catch (err: any) {
        console.error('Error loading users:', err)
        setUsers([])
      }
    }

    loadUsers()
  }, [fetchApi])

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

  const clientName =
    client?.person_type === 'N'
      ? `${client.first_name || ''} ${client.last_name || ''}`.trim()
      : client?.first_name || ''

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <FollowUpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refreshFollowUps}
        followUpTypes={followUpTypes}
        createFollowUp={createFollowUp}
      />
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'flex-start', md: 'space-between' },
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 3,
          gap: { xs: 2, md: 0 }
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          Seguimiento de:{' '}
          <Link href={ROUTES.CLIENTS.DETAIL(client?.id || '')}>
            <span className='text-primary'>{clientName}</span>
          </Link>
        </Typography>

        <Button
          variant='contained'
          size='large'
          onClick={() => setModalOpen(true)}
          startIcon={<i className='ri-add-line' />}
          sx={{
            alignSelf: { xs: 'stretch', md: 'auto' },
            mb: { xs: 0, md: 2 }
          }}
        >
          Nuevo Seguimiento
        </Button>
      </Box>

      <Stack spacing={3}>
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
