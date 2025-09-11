'use client'

import React, { useMemo } from 'react'

import { useParams } from 'next/navigation'

import EditIcon from '@mui/icons-material/Edit'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  Tab,
  MenuItem
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

import { TabContext, TabPanel } from '@mui/lab'

import TabList from '@core/components/mui/TabList'
import ClientPersonalData from '@/components/clients/ClientPersonalData'
import ClientContacts from '@/components/clients/ClientContacts'
import ClientRegistration from '@/components/clients/ClientRegistration'
import ClientBankAccounts from '@/components/clients/ClientBankAccounts'
import ClientDocuments from '@/components/clients/ClientDocuments'
import LegalData from '@/components/clients/LegalData'
import FollowUpSection from '@/components/clients/FollowUpSection'
import ClientNavButtons from '@/components/clients/ClientNavButtons'
import { useClient } from '@/hooks/useClient'
import { useCatalogs } from '@/hooks/useCatalogs'
import { usePageNavContent } from '@/hooks/usePageNavContent'

import type { Client } from '@/types/client'
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'
import { useSnackbar } from '@/hooks/useSnackbar'
import { useToast } from '@/context/ToastContext'

interface ClientProfileCardProps {
  client: Partial<Client>
  refreshClient: () => Promise<void>
}

const ClientProfileCard: React.FC<ClientProfileCardProps> = ({ client, refreshClient }) => {
  const { fetchApi } = useApi()
  const { showSuccess, showError } = useSnackbar()

  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const [form, setForm] = React.useState({
    first_name: client.first_name || '',
    last_name: client.last_name || '',
    document_number: client.document_number || '',
    source: (client.source as 'C' | 'P') || 'C',
    person_type: (client.person_type as 'N' | 'J') || 'N'
  })

  React.useEffect(() => {
    setForm({
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      document_number: client.document_number || '',
      source: (client.source as 'C' | 'P') || 'C',
      person_type: (client.person_type as 'N' | 'J') || 'N'
    })
  }, [client])

  const handleSave = async () => {
    try {
      const baseForm: ClientFormFields = clientApiToForm(client as Client)

      const mergedForm: ClientFormFields = {
        ...baseForm,
        first_name: form.first_name,

        last_name: form.person_type === 'N' ? form.last_name : baseForm.last_name,
        source: form.source,
        document_number: form.document_number
      }

      const apiPayload = clientFormToApi(mergedForm)

      await fetchApi(`clients/${client.id}`, { method: 'PUT', body: apiPayload })
      showSuccess('Cliente actualizado exitosamente')
      setOpenEdit(false)
      refreshClient()
    } catch (err: any) {
      showError(err?.message || 'Error al actualizar el cliente')
    }
  }

  const handleDelete = async () => {
    if (deleting) return
    setDeleting(true)
    try {
      await fetchApi(`clients/${client.id}`, { method: 'DELETE' })
      showSuccess('Cliente eliminado exitosamente')
      setOpenDelete(false)
      setTimeout(() => window.location.replace('/clients'), 500)
    } catch (err: any) {
      showError(err?.message || 'No fue posible eliminar el cliente')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2, p: 2 }}>
      <CardContent sx={{ position: 'relative' }}>
        <IconButton size='small' onClick={() => setOpenEdit(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <EditIcon />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src='/images/avatars/1.png'
            sx={{ width: 90, height: 90, mb: 1, border: '2px solid', borderColor: 'divider' }}
            alt={`${client.first_name} ${client.last_name}`}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='h6' fontWeight='bold'>
              {client.first_name} {client.last_name}
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            {client.person_type === 'N' ? 'Natural' : 'Jurídica'} - {client.document_number}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant='caption'
              sx={{ bgcolor: 'primary.lightOpacity', color: 'primary.main', p: 0.5, borderRadius: 1 }}
            >
              {form.source === 'P' ? 'Prospecto' : 'Cliente'}
            </Typography>
          </Box>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth='sm' fullWidth>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={'/images/avatars/1.png'}
                    sx={{ width: 64, height: 64, border: '2px solid', borderColor: 'divider' }}
                  />
                  <Button component='label' variant='outlined' size='small'>
                    Cambiar foto
                    <input
                      hidden
                      accept='image/*'
                      type='file'
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // TODO: Implementar subida de archivo
                        }
                      }}
                    />
                  </Button>
                </Box>
                <TextField
                  label='Nombre'
                  value={form.first_name}
                  onChange={e => setForm(prev => ({ ...prev, first_name: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label='Apellido'
                  value={form.last_name}
                  onChange={e => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                  fullWidth
                  disabled={form.person_type === 'J'}
                  helperText={form.person_type === 'J' ? 'No aplica para personas jurídicas' : undefined}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                  <TextField
                    label='Tipo'
                    value={form.source}
                    onChange={e => setForm(prev => ({ ...prev, source: e.target.value as 'C' | 'P' }))}
                    fullWidth
                    select
                  >
                    <MenuItem value='C'>Cliente</MenuItem>
                    <MenuItem value='P'>Prospecto</MenuItem>
                  </TextField>
                  <TextField
                    label='Nro. Documento'
                    value={form.document_number}
                    onChange={e => setForm(prev => ({ ...prev, document_number: e.target.value }))}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Box sx={{ flexGrow: 1 }}>
                <Button color='error' variant='outlined' onClick={() => setOpenDelete(true)}>
                  {deleting ? 'Eliminando...' : 'Eliminar cliente'}
                </Button>
              </Box>
              <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
              <Button variant='contained' onClick={handleSave}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>¿Seguro que deseas eliminar este cliente?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
            <Button color='error' onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

const ClientDetailsCard = ({
  client,
  clientId,
  cities,
  zones
}: {
  client: Partial<Client> & { cityName?: string; zoneName?: string }
  clientId: string
  cities: { id: number; name: string }[]
  zones: { id: number; name: string }[]
  onUpdated?: () => Promise<void> | void
}) => {
  const { fetchApi } = useApi()
  const { showSuccess, showError } = useSnackbar()
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = React.useState({
    mobile_1: client.mobile_1 || '',
    phone: client.phone || '',
    email_1: client.email_1 || '',
    email_2: client.email_2 || '',
    city_id: client.city_id ?? '',
    zone_id: client.zone_id ?? '',
    billing_address: client.billing_address || '',
    birth_date: client.birth_date || '',
    birth_place: client.birth_place || '',
    join_date: client.join_date || ''
  })

  const [citiesOptions, setCitiesOptions] = React.useState(cities || [])
  const [zonesOptions, setZonesOptions] = React.useState(zones || [])

  React.useEffect(() => {
    setCitiesOptions(cities || [])
  }, [cities])

  React.useEffect(() => {
    setZonesOptions(zones || [])
  }, [zones])

  React.useEffect(() => {
    const loadFallback = async () => {
      try {
        if (!cities || cities.length === 0) {
          const c = await fetchApi('catalogs/cities')

          if (Array.isArray(c)) setCitiesOptions(c)
        }

        if (!zones || zones.length === 0) {
          const z = await fetchApi('catalogs/zones')

          if (Array.isArray(z)) setZonesOptions(z)
        }
      } catch {}
    }

    loadFallback()
  }, [cities, zones, fetchApi])

  const updateClient = async () => {
    try {
      const formFromApi = clientApiToForm(client as Client)

      const mergedForm: ClientFormFields = { ...formFromApi, ...form }
      const apiPayload = clientFormToApi(mergedForm)

      await fetchApi(`clients/${clientId}`, {
        method: 'PUT',
        body: apiPayload
      })

      showSuccess('Cliente actualizado exitosamente')
      setOpen(false)
    } catch (err: any) {
      const apiMsg = err?.message || 'Ocurrió un error al actualizar el cliente'

      showError(apiMsg)

      throw err
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card elevation={0} sx={{ borderRadius: 2, position: 'relative' }}>
        <CardContent>
          <IconButton size='small' onClick={() => setOpen(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <EditIcon />
          </IconButton>

          <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
            Detalles
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Móvil
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.mobile_1 || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Fijo
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.phone || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Email 1
              </Typography>
              <Typography variant='body1' fontWeight='bold' title={form.email_1 || ''} sx={{ whiteSpace: 'nowrap' }}>
                {form.email_1 || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant='body2' color='text.secondary'>
                Email 2
              </Typography>
              <Typography variant='body1' fontWeight='bold' sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {form.email_2 || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Ciudad
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {client.cityName || citiesOptions.find(c => c.id === form.city_id)?.name || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Zona
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {client.zoneName || zonesOptions.find(z => z.id === form.zone_id)?.name || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary'>
                Dirección
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.billing_address || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Fecha Ingreso
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.join_date || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Fecha Nac./Fund.
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.birth_date || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary'>
                Lugar de Nac./Fund.
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {form.birth_place || '-'}
              </Typography>
            </Grid>
          </Grid>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <DatePicker
                  label='Fecha Ingreso'
                  value={form.join_date ? new Date(form.join_date) : null}
                  onChange={d => setForm(prev => ({ ...prev, join_date: d ? d.toISOString().split('T')[0] : '' }))}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
                <TextField
                  label='Móvil'
                  value={form.mobile_1}
                  onChange={e => setForm(prev => ({ ...prev, mobile_1: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label='Fijo'
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label='Email 1'
                  value={form.email_1}
                  onChange={e => setForm(prev => ({ ...prev, email_1: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label='Email 2'
                  value={form.email_2}
                  onChange={e => setForm(prev => ({ ...prev, email_2: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label='Dirección'
                  value={form.billing_address}
                  onChange={e => setForm(prev => ({ ...prev, billing_address: e.target.value }))}
                  fullWidth
                />
                <DatePicker
                  label='Fecha Nac./Fund.'
                  value={form.birth_date ? new Date(form.birth_date) : null}
                  onChange={d => setForm(prev => ({ ...prev, birth_date: d ? d.toISOString().split('T')[0] : '' }))}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
                <TextField
                  label='Lugar de Nac./Fund.'
                  value={form.birth_place}
                  onChange={e => setForm(prev => ({ ...prev, birth_place: e.target.value }))}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={updateClient} variant='contained'>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

const tabs = [
  { icon: <i className='ri-chat-follow-up-line' />, label: 'Seguimientos' },
  { icon: <i className='ri-archive-stack-line' />, label: 'Documentos' },
  { icon: <i className='ri-contacts-book-line' />, label: 'Contactos' },
  { icon: <i className='ri-bank-line' />, label: 'Info. Bancaria' },
  { icon: <i className='ri-booklet-line' />, label: 'Datos Personales' }
]

const ClientMainContent = ({
  client,
  refreshClient,
  clientId
}: {
  client: Partial<Client> & { professionName?: string; occupationName?: string }
  refreshClient: () => Promise<void>
  clientId: string
}) => {
  const [curTab, setTab] = React.useState(0)

  const shownExpiredRef = React.useRef<Set<string>>(new Set())
  const { showToastAlert } = useToast()

  const handleExpiredDocs = React.useCallback(
    (docs: any[]) => {
      if (!Array.isArray(docs) || docs.length === 0) return
      docs.forEach(d => {
        const id = (d.url || d.name || '') + (d.expiring_date || d.expiry_date || '')

        if (!id || shownExpiredRef.current.has(id)) return
        shownExpiredRef.current.add(id)

        const title = d.description || d.name || 'Documento'

        showToastAlert(`Documento vencido: ${title}`, () => setTab(1))
      })
    },
    [showToastAlert]
  )

  return (
    <>
      <TabContext value={curTab}>
        <TabList variant='scrollable' scrollButtons onChange={(_, val) => setTab(val)}>
          {tabs.map((tab, key) => (
            <Tab
              key={key}
              value={key}
              label={
                <Stack direction='row' gap={1}>
                  {tab.icon}
                  {tab.label}
                </Stack>
              }
            />
          ))}
        </TabList>
        <TabPanel keepMounted value={0}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <FollowUpSection clientId={clientId} />
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel keepMounted value={1}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <ClientDocuments
                client={{ id: String(client.id ?? '') }}
                refreshClient={refreshClient}
                onExpiredDocuments={handleExpiredDocs}
              />
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel keepMounted value={2}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <ClientContacts client={client} refreshClient={refreshClient} />
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel keepMounted value={3}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <ClientBankAccounts client={client} refreshClient={refreshClient} />
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel keepMounted value={4}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              {client.person_type === 'J' ? (
                <LegalData client={client} />
              ) : (
                <ClientPersonalData client={client} clientId={clientId} />
              )}
            </CardContent>
          </Card>
        </TabPanel>
      </TabContext>
    </>
  )
}

const ClientDetailPage = () => {
  const params = useParams()
  const clientId = params && typeof params.id === 'string' ? params.id : ''
  const navContent = useMemo(() => (clientId ? <ClientNavButtons clientId={clientId} /> : null), [clientId])
  const { data: client, isLoading, error, refreshClient } = useClient(clientId)
  const { catalogs, loading: catalogsLoading, error: catalogsError } = useCatalogs()

  usePageNavContent(navContent)

  if (isLoading || catalogsLoading) {
    return <Typography>Cargando...</Typography>
  }

  if (error || catalogsError) {
    return <Typography>Error: {error || catalogsError}</Typography>
  }

  if (!client) {
    return <Typography>No se encontró el cliente.</Typography>
  }

  const cityName = catalogs?.cities.find(c => c.id === client.city_id)?.name || 'N/A'

  const zoneName = catalogs?.zones.find(z => z.id === client.zone_id)?.name || 'N/A'

  const professionName =
    catalogs?.client_professions.find(p => p.id === client.personal_data?.profession_id)?.name || 'N/A'

  const occupationName =
    catalogs?.client_occupations.find(o => o.id === client.personal_data?.occupation_id)?.name || 'N/A'

  const clientWithDetails = {
    ...client,
    cityName,
    zoneName,
    professionName,
    occupationName
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container direction='column' spacing={4}>
            <Grid item xs={12}>
              <ClientProfileCard client={client} refreshClient={refreshClient} />
            </Grid>
            <Grid item xs={12}>
              <ClientDetailsCard
                client={clientWithDetails}
                clientId={clientId}
                cities={catalogs?.cities || []}
                zones={catalogs?.zones || []}
                onUpdated={refreshClient}
              />
            </Grid>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box>
                    <ClientRegistration client={client} clientId={clientId} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <ClientMainContent client={clientWithDetails} refreshClient={refreshClient} clientId={clientId} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClientDetailPage
