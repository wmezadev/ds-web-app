'use client'

import React from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  AccountBalance,
  Business,
  Cake,
  ContactPage,
  Description,
  Email,
  Home,
  Person,
  Phone,
  Place
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Snackbar
} from '@mui/material'
import Alert from '@mui/material/Alert'
import { DriveFileRenameOutline as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'

import ClientPersonalData from '@/components/clients/ClientPersonalData'
import ClientContacts from '@/components/clients/ClientContacts'
import ClientRegistration from '@/components/clients/ClientRegistration'
import ClientBankAccounts from '@/components/clients/ClientBankAccounts'
import LegalData from '@/components/clients/LegalData'
import { useClient } from '@/hooks/useClient'
import { useCatalogs } from '@/hooks/useCatalogs'
import type { Client } from '@/types/client'
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'

interface DetailItemProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' fontWeight='bold' sx={{ ml: 1 }}>
          {value}
        </Box>
      </Typography>
    </Box>
  )
}

interface DetailItemEditableProps {
  icon: React.ElementType
  label: string
  value: string | undefined | null
  onSave: (v: string) => Promise<void> | void
  placeholder?: string
}

const DetailItemEditable: React.FC<DetailItemEditableProps> = ({ icon: Icon, label, value, onSave, placeholder }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
          <EditableText value={value} onSave={onSave} placeholder={placeholder} />
        </Box>
      </Typography>
    </Box>
  )
}

interface EditableTextProps {
  value: string | undefined | null
  label?: string
  onSave: (newValue: string) => Promise<void> | void
  placeholder?: string
}

const EditableText: React.FC<EditableTextProps> = ({ value, onSave, placeholder }) => {
  const [editing, setEditing] = React.useState(false)
  const [local, setLocal] = React.useState(value ?? '')
  const [saving, setSaving] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  React.useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  const handleSave = async () => {
    if (saving) return
    const trimmed = (local ?? '').trim()

    if (trimmed === (value ?? '')) {
      setEditing(false)

      return
    }

    try {
      setSaving(true)
      await onSave(trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setLocal(value ?? '')
      setEditing(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {editing ? (
        <>
          <TextField
            inputRef={inputRef}
            size='small'
            variant='standard'
            hiddenLabel
            value={local}
            onChange={e => setLocal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            InputProps={{
              sx: {
                fontSize: '0.875rem',
                lineHeight: 1.5,
                fontWeight: 700,
                px: 0.25,
                py: 0,
                minHeight: 24
              },
              disableUnderline: true
            }}
            sx={{ minWidth: 120, alignSelf: 'center' }}
          />
          <Tooltip title='Guardar'>
            <span>
              <IconButton size='small' color='primary' onClick={handleSave} disabled={saving} sx={{ p: 0.25 }}>
                <CheckIcon fontSize='inherit' sx={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Cancelar'>
            <IconButton
              size='small'
              color='secondary'
              onClick={() => {
                setLocal(value ?? '')
                setEditing(false)
              }}
              sx={{ p: 0.25 }}
            >
              <CloseIcon fontSize='inherit' sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            <Box component='span' fontWeight='bold'>
              {value || placeholder || '—'}
            </Box>
          </Typography>
          <Tooltip title='Editar'>
            <IconButton size='small' onClick={() => setEditing(true)} sx={{ opacity: 0.7, p: 0.25 }}>
              <EditIcon fontSize='inherit' sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}

const ClientProfileCard = ({ client }: { client: Partial<Client> }) => (
  <Card elevation={0} sx={{ borderRadius: 2, p: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Avatar
          src='/images/avatars/1.png'
          sx={{ width: 90, height: 90, mb: 1, border: '2px solid', borderColor: 'divider' }}
          alt={`${client.first_name} ${client.last_name}`}
        />
        <Typography variant='h6' fontWeight='bold' sx={{ textAlign: 'center' }}>
          {`${client.first_name} ${client.last_name}`}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          {client.person_type === 'N' ? 'Natural' : 'Jurídica'} - {client.document_number}
        </Typography>
        <Typography
          variant='caption'
          sx={{ bgcolor: 'primary.lightOpacity', color: 'primary.main', p: 0.5, borderRadius: 1 }}
        >
          Cliente
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

const ClientDetailsCard = ({
  client,
  clientId
}: {
  client: Partial<Client> & { cityName?: string; zoneName?: string }
  clientId: string
  onUpdated: () => Promise<void>
}) => {
  const { fetchApi } = useApi()
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success')

  const [localDetails, setLocalDetails] = React.useState({
    billing_address: client.billing_address || '',
    birth_place: client.birth_place || ''
  })

  React.useEffect(() => {
    setLocalDetails({
      billing_address: client.billing_address || '',
      birth_place: client.birth_place || ''
    })
  }, [client.billing_address, client.birth_place])

  const updateClient = async (patch: Partial<ClientFormFields>) => {
    try {
      const formFromApi = clientApiToForm(client as Client)
      const mergedForm: ClientFormFields = { ...formFromApi, ...patch }
      const apiPayload = clientFormToApi(mergedForm)

      await fetchApi(`clients/${clientId}`, {
        method: 'PUT',
        body: apiPayload
      })

      setLocalDetails(prev => ({
        billing_address: patch.billing_address ?? prev.billing_address,
        birth_place: patch.birth_place ?? prev.birth_place
      }))

      setSnackbarSeverity('success')
      setSnackbarMessage('Cliente actualizado exitosamente')
      setSnackbarOpen(true)
    } catch (err: any) {
      const apiMsg = err?.message || 'Ocurrió un error al actualizar el cliente'

      setSnackbarSeverity('error')

      setSnackbarMessage(apiMsg)
      setSnackbarOpen(true)
      throw err
    }
  }

  const saveBirthPlace = async (newBirthPlace: string) => {
    await updateClient({ birth_place: newBirthPlace })
  }

  const saveBillingAddress = async (newBillingAddress: string) => {
    await updateClient({ billing_address: newBillingAddress })
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
          Detalles
        </Typography>
        <DetailItem
          icon={Cake}
          label='Fecha Ingreso'
          value={client.join_date ? new Date(client.join_date).toLocaleDateString('es-ES') : 'N/A'}
        />
        <Divider sx={{ my: 1 }} />
        <DetailItem icon={Phone} label='Teléfonos' value={`${client.mobile_1} | ${client.phone}`} />
        <DetailItem icon={Email} label='Correos' value={`${client.email_1} | ${client.email_2}`} />
        <Divider sx={{ my: 1 }} />
        <DetailItem icon={Business} label='Ciudad/Zona' value={`${client.cityName} / ${client.zoneName}`} />
        <DetailItemEditable
          icon={Home}
          label='Dirección'
          value={localDetails.billing_address}
          onSave={saveBillingAddress}
          placeholder='Ingrese la dirección'
        />
        <Divider sx={{ my: 1 }} />
        <DetailItem
          icon={Cake}
          label='Fecha Nac./Fund.'
          value={client.birth_date ? new Date(client.birth_date).toLocaleDateString('es-ES') : 'N/A'}
        />
        <DetailItemEditable
          icon={Place}
          label='Lugar de Nac./Fund.'
          value={localDetails.birth_place}
          onSave={saveBirthPlace}
          placeholder='Ingrese el lugar'
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  )
}

const tabs = [
  { label: 'Datos Personales', icon: <Person /> },
  { label: 'Contactos', icon: <ContactPage /> },
  { label: 'Documentos', icon: <Description /> },
  { label: 'Info. Bancaria', icon: <AccountBalance /> },
  { label: 'Registro', icon: <i className='ri-history-line' /> }
]

const ClientMainContent = ({
  client,
  refreshClient
}: {
  client: Partial<Client> & { professionName?: string; occupationName?: string }
  refreshClient: () => Promise<void>
}) => {
  const [value, setValue] = React.useState(0)
  const [, setShowArrows] = React.useState({ left: false, right: false })

  const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }, [])

  const scrollRef = React.useRef<HTMLDivElement>(null)

  const checkArrows = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const left = scrollLeft > 0
      const right = scrollLeft < scrollWidth - clientWidth - 1

      setShowArrows({ left, right })
    }
  }, [])

  React.useEffect(() => {
    const scrollElement = scrollRef.current

    if (scrollElement) {
      checkArrows()

      const resizeObserver = new ResizeObserver(checkArrows)

      resizeObserver.observe(scrollElement)
      scrollElement.addEventListener('scroll', checkArrows)

      return () => {
        resizeObserver.unobserve(scrollElement)

        scrollElement.removeEventListener('scroll', checkArrows)
      }
    }
  }, [checkArrows])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4
        }}
      >
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant={index === value ? 'contained' : 'text'}
            onClick={e => handleChange(e, index)}
            sx={{
              textTransform: 'none',
              minWidth: 'auto',
              whiteSpace: 'nowrap',
              mr: 1.5,
              py: 1.5,
              px: 1.8,
              fontSize: '0.9rem'
            }}
            startIcon={tab.icon}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {value === 0 && (
            <>
              {client.person_type === 'J' ? (
                <LegalData client={client} />
              ) : (
                <ClientPersonalData
                  client={client}
                  professionName={client.professionName}
                  occupationName={client.occupationName}
                />
              )}
            </>
          )}

          {value === 1 && (
            <Box>
              <ClientContacts client={client} refreshClient={refreshClient} />
            </Box>
          )}
          {value === 2 && (
            <Box>
              <Typography>Aquí irá la sección de Documentos</Typography>
            </Box>
          )}
          {value === 3 && (
            <Box>
              <ClientBankAccounts client={client} />
            </Box>
          )}
          {value === 4 && (
            <Box>
              <ClientRegistration client={client} />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}

const ClientDetailPage = () => {
  const params = useParams()
  const clientId = typeof params.id === 'string' ? params.id : ''
  const router = useRouter()
  const { data: client, isLoading, error, refreshClient } = useClient(clientId)
  const { catalogs, loading: catalogsLoading, error: catalogsError } = useCatalogs()

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

  const zoneName = catalogs?.zones.find(z => z.id === client.zone_id)?.description || 'N/A'

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          mb: 4
        }}
      >
        <Typography variant='h5' fontWeight='bold' sx={{ mb: { xs: 2, md: 0 } }}>
          {`Cliente ${client.first_name} ${client.last_name}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          <Button
            variant='text'
            startIcon={<i className='ri-line-chart-line' />}
            onClick={() => router.push(`/clients/${clientId}/follow-up`)}
          >
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>Seguimientos</Typography>
          </Button>
          <Button variant='text' startIcon={<i className='ri-shield-check-line' />}>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>Pólizas</Typography>
          </Button>
          <Button variant='text' startIcon={<i className='ri-receipt-line' />}>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>Recibos</Typography>
          </Button>
          <Button variant='text' startIcon={<i className='ri-shield-star-line' />}>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>Certificados</Typography>
          </Button>
          <Button variant='text' startIcon={<i className='ri-fire-line' />}>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>Siniestros</Typography>
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container direction='column' spacing={4}>
            <Grid item xs={12}>
              <ClientProfileCard client={client} />
            </Grid>
            <Grid item xs={12}>
              <ClientDetailsCard client={clientWithDetails} clientId={clientId} onUpdated={refreshClient} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <ClientMainContent client={clientWithDetails} refreshClient={refreshClient} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClientDetailPage
