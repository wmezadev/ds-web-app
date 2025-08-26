'use client'

import React, { useMemo, useState } from 'react'

import {
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
  IconButton
} from '@mui/material'
import Alert from '@mui/material/Alert'
import { Edit } from '@mui/icons-material'

import type { Client } from '@/types/client'
import { useCatalogs } from '@/hooks/useCatalogs'
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'

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

interface ClientRegistrationProps {
  client: Partial<Client>
  clientId: string
  refreshClient?: () => Promise<void>
}

const ClientRegistration: React.FC<ClientRegistrationProps> = ({ client, clientId }) => {
  const { catalogs } = useCatalogs()
  const { fetchApi } = useApi()

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const [form, setForm] = useState({
    client_category_id: client.client_category_id ?? '',
    office_id: client.office_id ?? '',
    agent_id: client.agent_id ?? '',
    executive_id: client.executive_id ?? '',
    client_group_id: client.client_group_id ?? '',
    client_branch_id: client.client_branch_id ?? '',
    notes: client.notes ?? ''
  })

  const [display, setDisplay] = useState({
    client_category_id: client.client_category_id ?? '',
    office_id: client.office_id ?? '',
    agent_id: client.agent_id ?? '',
    executive_id: client.executive_id ?? '',
    client_group_id: client.client_group_id ?? '',
    client_branch_id: client.client_branch_id ?? '',
    notes: client.notes ?? ''
  })

  React.useEffect(() => {
    setForm({
      client_category_id: client.client_category_id ?? '',
      office_id: client.office_id ?? '',
      agent_id: client.agent_id ?? '',
      executive_id: client.executive_id ?? '',
      client_group_id: client.client_group_id ?? '',
      client_branch_id: client.client_branch_id ?? '',
      notes: client.notes ?? ''
    })
    setDisplay({
      client_category_id: client.client_category_id ?? '',
      office_id: client.office_id ?? '',
      agent_id: client.agent_id ?? '',
      executive_id: client.executive_id ?? '',
      client_group_id: client.client_group_id ?? '',
      client_branch_id: client.client_branch_id ?? '',
      notes: client.notes ?? ''
    })
  }, [
    client.client_category_id,
    client.office_id,
    client.agent_id,
    client.executive_id,
    client.client_group_id,
    client.client_branch_id,
    client.notes
  ])

  const catalogNames = useMemo(() => {
    if (!catalogs)
      return {
        categoryName: '-',
        officeName: '-',
        agentName: '-',
        executiveName: '-',
        groupName: '-',
        branchName: '-'
      }

    return {
      categoryName: catalogs.client_categories.find(c => c.id === (display.client_category_id as any))?.name || '-',
      officeName: catalogs.offices.find(o => o.id === (display.office_id as any))?.name || '-',
      agentName: catalogs.agents.find(a => a.id === (display.agent_id as any))?.name || '-',
      executiveName: catalogs.executives.find(e => e.id === (display.executive_id as any))?.name || '-',
      groupName: catalogs.client_groups.find(g => g.id === (display.client_group_id as any))?.name || '-',
      branchName: catalogs.client_branches.find(b => b.id === (display.client_branch_id as any))?.name || '-'
    }
  }, [
    catalogs,
    display.client_category_id,
    display.office_id,
    display.agent_id,
    display.executive_id,
    display.client_group_id,
    display.client_branch_id
  ])

  const { categoryName, officeName, agentName, executiveName, groupName, branchName } = catalogNames

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <IconButton size='small' onClick={() => setOpen(true)} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Edit fontSize='small' />
        </IconButton>
        <Typography variant='h6' fontWeight='bold' sx={{ mb: 4 }}>
          Información de Registro
        </Typography>
        <Grid container spacing={4}>
          <DetailItem label='Categoría de Cliente' value={categoryName} />
          <DetailItem label='Oficina' value={officeName} />
          <DetailItem label='Agente' value={agentName} />
          <DetailItem label='Ejecutivo' value={executiveName} />
          <DetailItem label='Grupo de Cliente' value={groupName} />
          <DetailItem label='Sucursal de Cliente' value={branchName} />
          <Grid item xs={12}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Notas
              </Typography>
              <Typography variant='body1' fontWeight='bold'>
                {display.notes || '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Editar Información de Registro</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='client-category-label'>Categoría</InputLabel>
                <Select
                  labelId='client-category-label'
                  label='Categoría'
                  value={form.client_category_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, client_category_id: e.target.value }))}
                >
                  {(catalogs?.client_categories || []).map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='office-label'>Oficina</InputLabel>
                <Select
                  labelId='office-label'
                  label='Oficina'
                  value={form.office_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, office_id: e.target.value }))}
                >
                  {(catalogs?.offices || []).map(o => (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='agent-label'>Agente</InputLabel>
                <Select
                  labelId='agent-label'
                  label='Agente'
                  value={form.agent_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, agent_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.agents.find(a => a.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.agents || []).map(a => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='executive-label'>Ejecutivo</InputLabel>
                <Select
                  labelId='executive-label'
                  label='Ejecutivo'
                  value={form.executive_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, executive_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.executives.find(ex => ex.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.executives || []).map(ex => (
                    <MenuItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='group-label'>Grupo</InputLabel>
                <Select
                  labelId='group-label'
                  label='Grupo'
                  value={form.client_group_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, client_group_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.client_groups.find(g => g.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.client_groups || []).map(g => (
                    <MenuItem key={g.id} value={g.id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size='small'>
                <InputLabel id='branch-label'>Sucursal</InputLabel>
                <Select
                  labelId='branch-label'
                  label='Sucursal'
                  value={form.client_branch_id ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, client_branch_id: e.target.value }))}
                  displayEmpty
                  renderValue={selected =>
                    selected ? catalogs?.client_branches.find(b => b.id === (selected as any))?.name || '' : ''
                  }
                >
                  <MenuItem value=''>Sin asignar</MenuItem>
                  {(catalogs?.client_branches || []).map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Notas'
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={async () => {
              if (saving) return

              try {
                setSaving(true)

                // Build full payload via clientApiToForm -> merge -> clientFormToApi for backend compatibility
                const formFromApi = clientApiToForm(client as Client)

                const merged: ClientFormFields = {
                  ...formFromApi,
                  client_category_id: form.client_category_id as any,
                  office_id: form.office_id as any,
                  agent_id: (form.agent_id as any) || null,
                  executive_id: (form.executive_id as any) || null,
                  client_group_id: (form.client_group_id as any) || null,
                  client_branch_id: (form.client_branch_id as any) || null,
                  notes: form.notes
                }

                const payload = clientFormToApi(merged)

                await fetchApi(`clients/${clientId}`, { method: 'PUT', body: payload })

                setDisplay({
                  client_category_id: merged.client_category_id as any,
                  office_id: merged.office_id as any,
                  agent_id: (merged.agent_id as any) ?? '',
                  executive_id: (merged.executive_id as any) ?? '',
                  client_group_id: (merged.client_group_id as any) ?? '',
                  client_branch_id: (merged.client_branch_id as any) ?? '',
                  notes: merged.notes || ''
                })

                setSnackbar({ open: true, message: 'Información de registro actualizada', severity: 'success' })
                setOpen(false)
              } catch (e: any) {
                const msg = e?.message || 'No fue posible actualizar'

                setSnackbar({ open: true, message: msg, severity: 'error' })
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
          >
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

export default ClientRegistration
