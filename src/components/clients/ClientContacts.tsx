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
  IconButton
} from '@mui/material'

import { Add, Edit } from '@mui/icons-material'

import type { Client } from '@/types/client'
import { useApi } from '@/hooks/useApi'
import { clientApiToForm, clientFormToApi } from '@/components/clients/ClientForm'
import useSnackbar from '@/hooks/useSnackbar'

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
  const { showSuccess, showError } = useSnackbar()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleAddContact = () => {
    setNewContact({ full_name: '', position: '', phone: '', email: '', notes: '' })
    setModalOpen(true)
  }

  const handleEditContact = (index: number) => {
    const c = contacts[index] as {
      full_name: string
      position: string
      phone: string
      email: string
      notes?: string | null
    }

    setNewContact({
      full_name: c.full_name || '',
      position: c.position || '',
      phone: c.phone || '',
      email: c.email || '',
      notes: c.notes ?? ''
    })
    setIsEditing(true)
    setSelectedContactIndex(index)
    setModalOpen(true)
  }

  const handleSaveContact = async () => {
    if (saving) return
    setSaving(true)

    try {
      const form = clientApiToForm(client as Client)
      const updatedContacts = [...(form.contacts || [])]

      if (isEditing && selectedContactIndex !== null) {
        updatedContacts[selectedContactIndex] = newContact
      } else {
        updatedContacts.push(newContact)
      }

      const updatedForm = { ...form, contacts: updatedContacts }
      const apiPayload = clientFormToApi(updatedForm)

      await fetchApi(`clients/${client.id}`, { method: 'PUT', body: apiPayload })

      setContacts(updatedContacts)
      setModalOpen(false)
      showSuccess(isEditing ? 'Contacto actualizado exitosamente' : 'Contacto agregado exitosamente')
    } catch (err) {
      showError('No fue posible guardar el contacto')
    } finally {
      setSaving(false)
      setIsEditing(false)
      setSelectedContactIndex(null)
    }
  }

  const handleDeleteContact = async () => {
    if (saving) return
    if (!isEditing || selectedContactIndex === null) return
    setSaving(true)

    try {
      const form = clientApiToForm(client as Client)

      const updatedContacts = [...(form.contacts || [])]

      updatedContacts.splice(selectedContactIndex, 1)

      const updatedForm = { ...form, contacts: updatedContacts }
      const apiPayload = clientFormToApi(updatedForm)

      await fetchApi(`clients/${client.id}`, { method: 'PUT', body: apiPayload })

      setContacts(updatedContacts)
      setModalOpen(false)
      showSuccess('Contacto eliminado exitosamente')
    } catch (err) {
      showError('No fue posible eliminar el contacto')
      console.error(err)
    } finally {
      setSaving(false)
      setIsEditing(false)
      setSelectedContactIndex(null)
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
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, position: 'relative' }}>
              <IconButton
                size='small'
                onClick={() => handleEditContact(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Edit fontSize='small' />
              </IconButton>
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
        <DialogTitle>{isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}</DialogTitle>
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
          {isEditing && (
            <Button color='error' onClick={() => setConfirmDeleteOpen(true)} disabled={saving}>
              Eliminar
            </Button>
          )}
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleSaveContact} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant='body2'>
            ¿Está seguro que desea eliminar este contacto? Esta acción no se puede deshacer.
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
              handleDeleteContact()
            }}
            disabled={saving}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ClientContacts
