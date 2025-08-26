'use client'

import React from 'react'

import {
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  IconButton
} from '@mui/material'
import Alert from '@mui/material/Alert'
import { Edit } from '@mui/icons-material'

import type { Client } from '@/types/client'
import { useCatalogs } from '@/hooks/useCatalogs'
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'

const getCivilStatusDisplay = (status: string | null): string => {
  if (!status) return '-'

  const statusMap: Record<string, string> = {
    single: 'Soltero',
    married: 'Casado',
    divorced: 'Divorciado',
    widowed: 'Viudo'
  }

  return statusMap[status] || status
}

const getGenderDisplay = (gender: string | null): string => {
  if (!gender) return '-'
  const map: Record<string, string> = { M: 'Masculino', F: 'Femenino' }

  return map[gender] || gender
}

interface DetailItemProps {
  label: string
  value: React.ReactNode
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body1' fontWeight='bold'>
        {value ?? '-'}
      </Typography>
    </Box>
  </Grid>
)

interface ClientPersonalDataProps {
  client: Partial<Client>
  clientId: string
}

const ClientPersonalData: React.FC<ClientPersonalDataProps> = ({ client, clientId }) => {
  const { catalogs } = useCatalogs()
  const { fetchApi } = useApi()

  const [open, setOpen] = React.useState(false)

  const [saving, setSaving] = React.useState(false)

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const [display, setDisplay] = React.useState({
    gender: client.personal_data?.gender ?? '',
    civil_status: client.personal_data?.civil_status ?? '',
    height: client.personal_data?.height ?? '',
    weight: client.personal_data?.weight ?? '',
    smoker: Boolean(client.personal_data?.smoker) ?? false,
    sports: client.personal_data?.sports ?? '',
    pathology: client.personal_data?.pathology ?? '',
    profession_id: (client.personal_data as any)?.profession_id ?? '',
    occupation_id: (client.personal_data as any)?.occupation_id ?? '',
    monthly_income: (client.personal_data as any)?.monthly_income ?? '',
    rif: client.personal_data?.rif ?? ''
  })

  React.useEffect(() => {
    setDisplay({
      gender: client.personal_data?.gender ?? '',
      civil_status: client.personal_data?.civil_status ?? '',
      height: client.personal_data?.height ?? '',
      weight: client.personal_data?.weight ?? '',
      smoker: Boolean(client.personal_data?.smoker) ?? false,
      sports: client.personal_data?.sports ?? '',
      pathology: client.personal_data?.pathology ?? '',
      profession_id: (client.personal_data as any)?.profession_id ?? '',
      occupation_id: (client.personal_data as any)?.occupation_id ?? '',
      monthly_income: (client.personal_data as any)?.monthly_income ?? '',
      rif: client.personal_data?.rif ?? ''
    })
  }, [client.personal_data])

  const [form, setForm] = React.useState({
    gender: client.personal_data?.gender ?? '',
    civil_status: client.personal_data?.civil_status ?? '',
    height: client.personal_data?.height ?? '',
    weight: client.personal_data?.weight ?? '',
    smoker: Boolean(client.personal_data?.smoker) ?? false,
    sports: client.personal_data?.sports ?? '',
    pathology: client.personal_data?.pathology ?? '',
    profession_id: (client.personal_data as any)?.profession_id ?? '',
    occupation_id: (client.personal_data as any)?.occupation_id ?? '',
    monthly_income: (client.personal_data as any)?.monthly_income ?? '',
    rif: client.personal_data?.rif ?? ''
  })

  React.useEffect(() => {
    setForm({
      gender: client.personal_data?.gender ?? '',
      civil_status: client.personal_data?.civil_status ?? '',
      height: client.personal_data?.height ?? '',
      weight: client.personal_data?.weight ?? '',
      smoker: Boolean(client.personal_data?.smoker) ?? false,
      sports: client.personal_data?.sports ?? '',
      pathology: client.personal_data?.pathology ?? '',
      profession_id: (client.personal_data as any)?.profession_id ?? '',
      occupation_id: (client.personal_data as any)?.occupation_id ?? '',
      monthly_income: (client.personal_data as any)?.monthly_income ?? '',
      rif: client.personal_data?.rif ?? ''
    })
  }, [client.personal_data])

  const handleSave = async () => {
    if (saving) return

    try {
      setSaving(true)
      const formFromApi = clientApiToForm(client as Client)

      const merged: ClientFormFields = {
        ...formFromApi,
        personal_data: {
          ...formFromApi.personal_data,
          gender: form.gender || undefined,
          civil_status: form.civil_status || undefined,
          height: form.height ? Number(form.height) : 0,
          weight: form.weight ? Number(form.weight) : 0,
          smoker: Boolean(form.smoker),
          sports: form.sports || undefined,
          pathology: form.pathology || undefined,
          profession_id: form.profession_id ? Number(form.profession_id as any) : 0,
          occupation_id: form.occupation_id ? Number(form.occupation_id as any) : 0,
          monthly_income: form.monthly_income ? Number(form.monthly_income) : 0,
          rif: form.rif || undefined
        }
      }

      const payload = clientFormToApi(merged)

      await fetchApi(`clients/${clientId}`, { method: 'PUT', body: payload })

      setDisplay({ ...form })
      setSnackbar({ open: true, message: 'Datos personales actualizados', severity: 'success' })
      setOpen(false)
    } catch (e: any) {
      const msg = e?.message || 'No fue posible actualizar'

      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const { personal_data } = client

  if (!personal_data) {
    return <Typography>No hay datos personales disponibles.</Typography>
  }

  const professionName = catalogs?.client_professions.find(p => p.id === (display.profession_id as any))?.name || '-'
  const occupationName = catalogs?.client_occupations.find(o => o.id === (display.occupation_id as any))?.name || '-'

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <IconButton size='small' onClick={() => setOpen(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Edit fontSize='small' />
        </IconButton>
        <Typography variant='h6' fontWeight='bold' sx={{ mb: 4 }}>
          Datos Personales
        </Typography>
        <Grid container spacing={4}>
          <DetailItem label='Género' value={getGenderDisplay(display.gender as any)} />
          <DetailItem label='Estado Civil' value={getCivilStatusDisplay(display.civil_status as any)} />
          <DetailItem label='Altura (cm)' value={display.height} />
          <DetailItem label='Peso (kg)' value={display.weight} />
          <DetailItem label='Fumador' value={display.smoker ? 'Sí' : 'No'} />
          <DetailItem label='Deportes' value={display.sports} />
          <DetailItem label='Patología' value={display.pathology} />
          <DetailItem label='Profesión' value={professionName} />
          <DetailItem label='Ocupación' value={occupationName} />
          <DetailItem label='Ingreso Mensual' value={display.monthly_income} />
          <DetailItem label='RIF' value={display.rif} />
        </Grid>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Editar Datos Personales</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='gender-label'>Género</InputLabel>
                <Select
                  labelId='gender-label'
                  label='Género'
                  value={form.gender ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, gender: e.target.value as string }))}
                >
                  <MenuItem value='M'>Masculino</MenuItem>
                  <MenuItem value='F'>Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='civil-status-label'>Estado Civil</InputLabel>
                <Select
                  labelId='civil-status-label'
                  label='Estado Civil'
                  value={form.civil_status ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, civil_status: e.target.value as string }))}
                >
                  <MenuItem value='single'>Soltero</MenuItem>
                  <MenuItem value='married'>Casado</MenuItem>
                  <MenuItem value='divorced'>Divorciado</MenuItem>
                  <MenuItem value='widowed'>Viudo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                type='number'
                label='Altura (cm)'
                value={form.height}
                onChange={e => setForm(prev => ({ ...prev, height: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                type='number'
                label='Peso (kg)'
                value={form.weight}
                onChange={e => setForm(prev => ({ ...prev, weight: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='smoker-label'>Fumador</InputLabel>
                <Select
                  labelId='smoker-label'
                  label='Fumador'
                  value={form.smoker ? 'Si' : 'No'}
                  onChange={e => setForm(prev => ({ ...prev, smoker: (e.target.value as string) === 'Si' }))}
                >
                  <MenuItem value='Si'>Sí</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='Deportes'
                value={form.sports}
                onChange={e => setForm(prev => ({ ...prev, sports: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size='small'
                label='Patología'
                value={form.pathology}
                onChange={e => setForm(prev => ({ ...prev, pathology: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='profession-label'>Profesión</InputLabel>
                <Select
                  labelId='profession-label'
                  label='Profesión'
                  value={(form.profession_id as any) ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, profession_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.client_professions.find(p => p.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.client_professions || []).map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='occupation-label'>Ocupación</InputLabel>
                <Select
                  labelId='occupation-label'
                  label='Ocupación'
                  value={(form.occupation_id as any) ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, occupation_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.client_occupations.find(o => o.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.client_occupations || []).map(o => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                type='number'
                label='Ingreso Mensual'
                value={form.monthly_income}
                onChange={e => setForm(prev => ({ ...prev, monthly_income: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size='small'
                label='RIF'
                value={form.rif}
                onChange={e => setForm(prev => ({ ...prev, rif: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ClientPersonalData
