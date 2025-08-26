'use client'

import React, { useState } from 'react'

import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton
} from '@mui/material'

import Alert from '@mui/material/Alert'
import { Add, Edit } from '@mui/icons-material'

import type { Client } from '@/types/client'
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
      <Typography variant='body1' fontWeight='medium'>
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

interface ClientBankAccountsProps {
  client: Partial<Client>
  refreshClient: () => Promise<void>
}

const ClientBankAccounts: React.FC<ClientBankAccountsProps> = ({ client }) => {
  const [bankAccounts, setBankAccounts] = useState(client.bank_accounts || [])
  const [modalOpen, setModalOpen] = useState(false)
  const { fetchApi } = useApi()

  const [newBankAccount, setNewBankAccount] = useState({
    bank_name: '',
    account_number: '',
    currency: '',
    account_type: '',
    notes: ''
  })

  const [saving, setSaving] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleAddAccount = () => {
    setNewBankAccount({ bank_name: '', account_number: '', currency: '', account_type: '', notes: '' })
    setModalOpen(true)
  }

  const handleEditAccount = (index: number) => {
    const acc = bankAccounts[index] as {
      bank_name: string
      account_number: string
      currency: string
      account_type: string
      notes?: string | null
    }

    setNewBankAccount({
      bank_name: acc.bank_name || '',
      account_number: acc.account_number || '',
      currency: acc.currency || '',
      account_type: acc.account_type || '',
      notes: acc.notes ?? ''
    })
    setIsEditing(true)
    setSelectedAccountIndex(index)
    setModalOpen(true)
  }

  const handleSaveAccount = async () => {
    if (saving) return

    setSaving(true)

    try {
      const formFromApi = clientApiToForm(client as Client)
      const updatedBankAccounts = [...(formFromApi.bank_accounts || [])]

      if (isEditing && selectedAccountIndex !== null) {
        updatedBankAccounts[selectedAccountIndex] = newBankAccount
      } else {
        updatedBankAccounts.push(newBankAccount)
      }

      const mergedForm: ClientFormFields = { ...formFromApi, bank_accounts: updatedBankAccounts as any }
      const apiPayload = clientFormToApi(mergedForm)

      await fetchApi(`clients/${client.id}`, {
        method: 'PUT',
        body: apiPayload
      })

      setBankAccounts(updatedBankAccounts)
      setModalOpen(false)
      setSnackbarSeverity('success')
      setSnackbarMessage(
        isEditing ? 'Cuenta bancaria actualizada exitosamente' : 'Cuenta bancaria agregada exitosamente'
      )
      setSnackbarOpen(true)
    } catch (err) {
      console.error(err)
      setSnackbarSeverity('error')
      setSnackbarMessage('No fue posible guardar la cuenta bancaria')
      setSnackbarOpen(true)
    } finally {
      setSaving(false)
      setIsEditing(false)
      setSelectedAccountIndex(null)
    }
  }

  const handleDeleteAccount = async () => {
    if (saving) return
    if (!isEditing || selectedAccountIndex === null) return
    setSaving(true)

    try {
      const formFromApi = clientApiToForm(client as Client)

      const updatedBankAccounts = [...(formFromApi.bank_accounts || [])]

      updatedBankAccounts.splice(selectedAccountIndex, 1)

      const mergedForm: ClientFormFields = { ...formFromApi, bank_accounts: updatedBankAccounts as any }
      const apiPayload = clientFormToApi(mergedForm)

      await fetchApi(`clients/${client.id}`, {
        method: 'PUT',
        body: apiPayload
      })

      setBankAccounts(updatedBankAccounts)
      setModalOpen(false)
      setSnackbarSeverity('success')
      setSnackbarMessage('Cuenta bancaria eliminada exitosamente')
      setSnackbarOpen(true)
    } catch (err) {
      console.error(err)
      setSnackbarSeverity('error')
      setSnackbarMessage('No fue posible eliminar la cuenta bancaria')
      setSnackbarOpen(true)
    } finally {
      setSaving(false)
      setIsEditing(false)
      setSelectedAccountIndex(null)
      setConfirmDeleteOpen(false)
    }
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Información Bancaria
        </Typography>
        <Button variant='outlined' startIcon={<Add />} onClick={handleAddAccount}>
          Nueva Cuenta
        </Button>
      </Stack>

      {bankAccounts.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay cuentas bancarias registradas.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {bankAccounts.map((account, index) => (
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, position: 'relative' }}>
              <IconButton
                size='small'
                onClick={() => handleEditAccount(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Edit fontSize='small' />
              </IconButton>
              <Grid container spacing={3}>
                <DetailItem label='Banco' value={account.bank_name} />
                <DetailItem label='Número de Cuenta' value={account.account_number} />
                <DetailItem label='Moneda' value={account.currency} />
                <DetailItem label='Tipo de Cuenta' value={account.account_type} />
                {account.notes && <DetailItem label='Notas' value={account.notes} />}
              </Grid>
            </Box>
          ))}
        </Stack>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>{isEditing ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label='Banco'
              value={newBankAccount.bank_name}
              onChange={e => setNewBankAccount(prev => ({ ...prev, bank_name: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Número de Cuenta'
              value={newBankAccount.account_number}
              onChange={e => setNewBankAccount(prev => ({ ...prev, account_number: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Moneda'
              value={newBankAccount.currency}
              onChange={e => setNewBankAccount(prev => ({ ...prev, currency: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Tipo de Cuenta'
              value={newBankAccount.account_type}
              onChange={e => setNewBankAccount(prev => ({ ...prev, account_type: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Notas'
              value={newBankAccount.notes}
              onChange={e => setNewBankAccount(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {isEditing && (
            <Button color='error' onClick={() => setConfirmDeleteOpen(true)} disabled={saving}>
              Eliminar
            </Button>
          )}
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleSaveAccount} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant='body2'>
            ¿Está seguro que desea eliminar esta cuenta bancaria? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            color='error'
            variant='contained'
            onClick={() => {
              setConfirmDeleteOpen(false)
              handleDeleteAccount()
            }}
            disabled={saving}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  )
}

export default ClientBankAccounts
