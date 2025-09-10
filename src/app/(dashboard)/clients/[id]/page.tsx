'use client'

import React, { useMemo } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Business, Cake, Email, Home, Phone, Place, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'

import EditIcon from '@mui/icons-material/Edit'

import { Business, Cake, Email, Home, Phone, Place, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material'

import EditIcon from '@mui/icons-material/Edit'

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Autocomplete,
  Stack,
  Tab
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
import useSnackbar from '@/hooks/useSnackbar'
import { useToast } from '@/context/ToastContext'

interface DetailItemEditablePairProps {
  icon: React.ElementType
  label: string
  value1: string | null | undefined
  value2: string | null | undefined
  onSave: (v1: string, v2: string) => Promise<void> | void
  placeholder1?: string
  placeholder2?: string
}

const DetailItemEditablePair: React.FC<DetailItemEditablePairProps> = ({
  icon: Icon,
  label,
  value1,
  value2,
  onSave,
  placeholder1,
  placeholder2
}) => {
  const [editing, setEditing] = React.useState(false)
  const [local1, setLocal1] = React.useState(value1 ?? '')
  const [local2, setLocal2] = React.useState(value2 ?? '')

  React.useEffect(() => {
    setLocal1(value1 ?? '')
    setLocal2(value2 ?? '')
  }, [value1, value2])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' sx={{ ml: 1, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {editing ? (
            <>
              <TextField
                size='small'
                variant='standard'
                hiddenLabel
                value={local1}
                onChange={e => setLocal1(e.target.value)}
                placeholder={placeholder1}
                InputProps={{
                  sx: { fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 700, px: 0.25, py: 0, minHeight: 24 },
                  disableUnderline: true
                }}
                sx={{ minWidth: 120, alignSelf: 'center' }}
              />
              <Box sx={{ color: 'text.disabled' }}>|</Box>
              <TextField
                size='small'
                variant='standard'
                hiddenLabel
                value={local2}
                onChange={e => setLocal2(e.target.value)}
                placeholder={placeholder2}
                InputProps={{
                  sx: { fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 700, px: 0.25, py: 0, minHeight: 24 },
                  disableUnderline: true
                }}
                sx={{ minWidth: 120, alignSelf: 'center' }}
              />
              <Tooltip title='Guardar'>
                <span>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => {
                      onSave(local1, local2)
                      setEditing(false)
                    }}
                    sx={{ p: 0.25 }}
                  >
                    <CheckIcon fontSize='inherit' sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title='Cancelar'>
                <IconButton
                  size='small'
                  color='secondary'
                  onClick={() => {
                    setLocal1(value1 ?? '')
                    setLocal2(value2 ?? '')
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
              <Box component='span' fontWeight='bold'>
                {`${value1 || ''} | ${value2 || ''}` || '—'}
              </Box>
              <Tooltip title='Editar'>
                <IconButton size='small' onClick={() => setEditing(true)} sx={{ opacity: 0.7, p: 0.25 }}>
                  <EditIcon fontSize='inherit' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Typography>
    </Box>
  )
}

interface DetailItemEditableCityZoneProps {
  icon: React.ElementType
  label: string
  cityId: number | null | undefined
  zoneId: number | null | undefined
  cities: { id: number; name: string }[]
  zones: { id: number; name: string }[]
  onSave: (cityId: number | null, zoneId: number | null) => Promise<void> | void
}

const DetailItemEditableCityZone: React.FC<DetailItemEditableCityZoneProps> = ({
  icon: Icon,
  label,
  cityId,
  zoneId,
  cities,
  zones,
  onSave
}) => {
  const [editing, setEditing] = React.useState(false)
  const [localCity, setLocalCity] = React.useState<number | null>(cityId && Number(cityId) > 0 ? Number(cityId) : null)
  const [localZone, setLocalZone] = React.useState<number | null>(zoneId && Number(zoneId) > 0 ? Number(zoneId) : null)

  React.useEffect(() => {
    setLocalCity(cityId && Number(cityId) > 0 ? Number(cityId) : null)
    setLocalZone(zoneId && Number(zoneId) > 0 ? Number(zoneId) : null)
  }, [cityId, zoneId])

  const normalizedCityId = cityId && Number(cityId) > 0 ? Number(cityId) : null
  const normalizedZoneId = zoneId && Number(zoneId) > 0 ? Number(zoneId) : null
  const cityOption = cities.find(c => Number(c.id) === Number(localCity)) || null

  const zoneOption = zones.find(z => Number(z.id) === Number(localZone)) || null

  const displayCityId = localCity ?? normalizedCityId
  const displayZoneId = localZone ?? normalizedZoneId

  const getCityLabel = (id: number | null) => {
    if (!id) return ''

    const c = cities.find(x => Number(x.id) === Number(id))

    return (c as any)?.name || (c as any)?.description || ''
  }

  const getZoneLabel = (id: number | null) => {
    if (!id) return ''

    const z = zones.find(x => Number(x.id) === Number(id))

    return (z as any)?.description || (z as any)?.name || ''
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' sx={{ ml: 1, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {editing ? (
            <>
              <Autocomplete
                options={cities}
                getOptionLabel={o => o?.name || (o as any)?.description || ''}
                isOptionEqualToValue={(a, b) => Number(a.id) === Number(b.id)}
                value={cityOption}
                onChange={(_, newVal) => {
                  setLocalCity(newVal ? Number((newVal as any).id) : null)

                  setLocalZone(null)
                }}
                sx={{ width: 180 }}
                noOptionsText='Sin opciones'
                renderInput={params => (
                  <TextField
                    {...params}
                    size='small'
                    variant='standard'
                    hiddenLabel
                    InputProps={{
                      ...params.InputProps,
                      sx: { fontSize: '0.875rem', fontWeight: 700 },
                      disableUnderline: true
                    }}
                  />
                )}
              />
              <Autocomplete
                options={zones}
                getOptionLabel={o => o?.name || (o as any)?.name || ''}
                isOptionEqualToValue={(a, b) => Number(a.id) === Number(b.id)}
                value={zoneOption}
                onChange={(_, newVal) => setLocalZone(newVal ? Number((newVal as any).id) : null)}
                sx={{ width: 180 }}
                noOptionsText='Sin opciones'
                renderInput={params => (
                  <TextField
                    {...params}
                    size='small'
                    variant='standard'
                    hiddenLabel
                    InputProps={{
                      ...params.InputProps,
                      sx: { fontSize: '0.875rem', fontWeight: 700 },
                      disableUnderline: true
                    }}
                  />
                )}
              />
              <Tooltip title='Guardar'>
                <span>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => {
                      onSave(localCity, localZone)
                      setEditing(false)
                    }}
                    sx={{ p: 0.25 }}
                  >
                    <CheckIcon fontSize='inherit' sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title='Cancelar'>
                <IconButton
                  size='small'
                  color='secondary'
                  onClick={() => {
                    setLocalCity(cityId ?? null)
                    setLocalZone(zoneId ?? null)
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
              <Box
                component='span'
                fontWeight='bold'
              >{`${getCityLabel(displayCityId)} / ${getZoneLabel(displayZoneId)}`}</Box>
              <Tooltip title='Editar'>
                <IconButton size='small' onClick={() => setEditing(true)} sx={{ opacity: 0.7, p: 0.25 }}>
                  <EditIcon fontSize='inherit' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
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
  type?: 'text' | 'date'
}

const DetailItemEditable: React.FC<DetailItemEditableProps> = ({
  icon: Icon,
  label,
  value,
  onSave,
  placeholder,
  type = 'text'
}) => {
  const [editing, setEditing] = React.useState(false)
  const [local, setLocal] = React.useState(value ?? '')

  React.useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' sx={{ ml: 1, display: 'inline-flex', alignItems: 'center' }}>
          {editing ? (
            type === 'date' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DatePicker
                  value={local ? new Date(local) : null}
                  onChange={newDate => {
                    if (newDate) {
                      const iso = newDate.toISOString().split('T')[0]

                      setLocal(iso)
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',

                      variant: 'standard',
                      hiddenLabel: true,
                      InputProps: {
                        sx: {
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          fontWeight: 700,
                          px: 0.25,
                          py: 0,
                          minHeight: 24
                        },
                        disableUnderline: true
                      },
                      sx: { minWidth: 120, alignSelf: 'center' }
                    }
                  }}
                />
                <Tooltip title='Guardar'>
                  <span>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => {
                        onSave(local)
                        setEditing(false)
                      }}
                      sx={{ p: 0.25 }}
                    >
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
              </Box>
            ) : (
              <EditableText
                value={local}
                onSave={v => {
                  onSave(v)
                  setEditing(false)
                }}
                placeholder={placeholder}
              />
            )
          ) : (
            <>
              <Box component='span' fontWeight='bold'>
                {value || placeholder || '—'}
              </Box>
              <Tooltip title='Editar'>
                <IconButton size='small' onClick={() => setEditing(true)} sx={{ opacity: 0.7, p: 0.25 }}>
                  <EditIcon fontSize='inherit' sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
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
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
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
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [deleting, setDeleting] = React.useState(false)

  const [citiesOptions, setCitiesOptions] = React.useState(cities || [])
  const [zonesOptions, setZonesOptions] = React.useState(zones || [])
  const [confirmOpen, setConfirmOpen] = React.useState(false)

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

      setSnackbar({
        open: true,
        message: 'Cliente actualizado exitosamente',
        severity: 'success'
      })
      setOpen(false)
    } catch (err: any) {
      const apiMsg = err?.message || 'Ocurrió un error al actualizar el cliente'
      setSnackbar({ open: true, message: apiMsg, severity: 'error' })
      throw err
    }
  }

  const handleOpenConfirm = () => setConfirmOpen(true)
  const handleCloseConfirm = () => setConfirmOpen(false)

  const handleConfirmDelete = async () => {
    if (deleting) return
    setDeleting(true)

    try {
      await fetchApi(`clients/${clientId}`, { method: 'DELETE' })

      setSnackbar({
        open: true,
        message: 'Cliente eliminado exitosamente',
        severity: 'success'
      })
      setConfirmOpen(false)
      setTimeout(() => router.replace('/clients'), 1200)
    } catch (err: any) {
      const msg = String(err?.message || '')
      if (msg.includes('status: 404')) {
        setSnackbar({
          open: true,
          message: 'Cliente eliminado exitosamente',
          severity: 'success'
        })
        setConfirmOpen(false)
        setTimeout(() => router.replace('/clients'), 1200)
      } else {
        setSnackbar({
          open: true,
          message: 'No fue posible eliminar el cliente',
          severity: 'error'
        })
      }
    } finally {
      setDeleting(false)
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
              <Typography variant='body1' fontWeight='bold'>
                {form.email_1 || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Email 2
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
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
              <ClientProfileCard client={client} />
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
