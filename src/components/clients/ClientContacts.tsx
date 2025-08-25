'use client'

import { useState } from 'react'
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
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi } from '@/components/clients/ClientForm'

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

interface ClientContactsProps {
  client: Partial<Client>
  refreshClient: () => Promise<void>
}

const ClientContacts: React.FC<ClientContactsProps> = ({ client }) => {
  const { fetchApi } = useApi()
  const [contacts, setContacts] = useState(client.contacts || [])
  const [modalOpen, setModalOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    full_name: '',
    position: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const handleAddContact = () => {
    setNewContact({ full_name: '', position: '', phone: '', email: '', notes: '' })
    setModalOpen(true)
  }

  const handleSaveContact = async () => {
    if (saving) return
    setSaving(true)
    try {
      const form = clientApiToForm(client as Client)
      const updatedForm = { ...form, contacts: [...(form.contacts || []), newContact] }
      const apiPayload = clientFormToApi(updatedForm)

      await fetchApi(`clients/${client.id}`, { method: 'PUT', body: apiPayload })

      setContacts(prev => [...prev, newContact])
      setModalOpen(false)
      setSnackbarSeverity('success')
      setSnackbarMessage('Contacto agregado exitosamente')
      setSnackbarOpen(true)
    } catch (err) {
      setSnackbarSeverity('error')
      setSnackbarMessage('No fue posible agregar el contacto')
      setSnackbarOpen(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Contactos
        </Typography>
        <Button variant='outlined' startIcon={<Add />} onClick={handleAddContact}>
          Nuevo Contacto
        </Button>
      </Stack>

      {contacts.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay contactos registrados.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {contacts.map((contact, index) => (
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Grid container spacing={3}>
                <DetailItem label='Nombre Completo' value={contact.full_name} />
                <DetailItem label='Posición/Cargo' value={contact.position} />
                <DetailItem label='Teléfono' value={contact.phone} />
                <DetailItem label='Email' value={contact.email} />
                {contact.notes && <DetailItem label='Notas' value={contact.notes} />}
              </Grid>
            </Box>
          ))}
        </Stack>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Nuevo Contacto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label='Nombre Completo'
              value={newContact.full_name}
              onChange={e => setNewContact(prev => ({ ...prev, full_name: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Posición/Cargo'
              value={newContact.position}
              onChange={e => setNewContact(prev => ({ ...prev, position: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Teléfono'
              value={newContact.phone}
              onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Email'
              value={newContact.email}
              onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            <TextField
              label='Notas'
              value={newContact.notes}
              onChange={e => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
              multiline
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleSaveContact} disabled={saving}>
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

export default ClientContacts
