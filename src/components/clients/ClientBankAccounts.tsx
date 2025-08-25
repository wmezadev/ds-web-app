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
  Snackbar
} from '@mui/material'
import Alert from '@mui/material/Alert'
import { Add } from '@mui/icons-material'
import type { Client } from '@/types/client'

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

const ClientBankAccounts: React.FC<ClientBankAccountsProps> = ({ client, refreshClient }) => {
  const [bankAccounts, setBankAccounts] = useState(client.bank_accounts || [])
  const [modalOpen, setModalOpen] = useState(false)
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

  const handleAddAccount = () => {
    setNewBankAccount({ bank_name: '', account_number: '', currency: '', account_type: '', notes: '' })
    setModalOpen(true)
  }

  const handleSaveAccount = async () => {
    if (saving) return
    setSaving(true)
    try {
      const updatedClient = {
        ...client,
        bank_accounts: [...(client.bank_accounts || []), newBankAccount]
      }

      const res = await fetch(`/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      })

      if (!res.ok) throw new Error('Error al guardar la cuenta bancaria')

      setBankAccounts(prev => [...prev, newBankAccount])
      setModalOpen(false)
      setSnackbarSeverity('success')
      setSnackbarMessage('Cuenta bancaria agregada exitosamente')
      setSnackbarOpen(true)

      if (refreshClient) await refreshClient()
    } catch (err) {
      console.error(err)
      setSnackbarSeverity('error')
      setSnackbarMessage('No fue posible agregar la cuenta bancaria')
      setSnackbarOpen(true)
    } finally {
      setSaving(false)
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
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
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
        <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
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
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleSaveAccount} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
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
