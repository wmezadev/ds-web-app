'use client'

import { useState, useEffect } from 'react'

import { Box, Grid, IconButton, Stack, TextField, Typography, Button, Alert } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import { API_ROUTES } from '@/constants/routes'
import { clientFormToApi, type ClientFormFields } from '../ClientForm'

const ContactListFields = () => {
  const { control, register, getValues } = useFormContext<ClientFormFields>()
  const { fetchApi } = useApi()
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'contacts'
  })

  const formData = getValues()
  const clientId = formData.id
  const localStorageKey = `client-${clientId}-contacts`

  // Load contacts from localStorage on component mount
  useEffect(() => {
    if (clientId) {
      const savedContacts = localStorage.getItem(localStorageKey)
      if (savedContacts) {
        try {
          const contacts = JSON.parse(savedContacts)
          console.log('[ContactListFields] Loaded contacts from localStorage:', contacts)
          // Update form with saved contacts if they exist
          if (contacts.length > 0 && fields.length === 0) {
            contacts.forEach((contact: any) => append(contact))
          }
        } catch (error) {
          console.error('[ContactListFields] Error loading contacts from localStorage:', error)
        }
      }
    }
  }, [clientId, localStorageKey, append, fields.length])

  // Save contacts to localStorage whenever they change
  const saveToLocalStorage = (contacts: any[]) => {
    if (clientId) {
      localStorage.setItem(localStorageKey, JSON.stringify(contacts))
      console.log('[ContactListFields] Saved contacts to localStorage:', contacts)
    }
  }

  const handleAddContact = () => {
    append({
      full_name: '',
      position: '',
      phone: '',
      email: '',
      notes: ''
    })
  }

  const handleDeleteContact = (index: number) => {
    // Remove from form
    remove(index)
    
    // Update localStorage with remaining contacts
    const formData = getValues()
    const remainingContacts = (formData.contacts || []).filter((_, i) => i !== index)
    saveToLocalStorage(remainingContacts)
    
    setDeleteMessage('🗑️ Contacto eliminado')
    setTimeout(() => setDeleteMessage(null), 2000)
    
    console.log('[ContactListFields] Contact deleted, remaining contacts saved to localStorage')
  }





  return (
    <Box>
      {/* Header con botón */}
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Contactos</Typography>
        <Button variant='outlined' onClick={handleAddContact} startIcon={<Add />}>
          Nuevo Contacto
        </Button>
      </Stack>

      {/* Delete Message */}
      {deleteMessage && (
        <Alert severity='info' sx={{ mb: 2 }}>
          {deleteMessage}
        </Alert>
      )}

      {fields.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay contactos añadidos aún.
        </Typography>
      ) : (
        fields.map((field, index) => (
          <Box key={field.id} mb={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Nombre Completo'
                  placeholder='Juan Pérez'
                  {...register(`contacts.${index}.full_name`)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Posición/Cargo'
                  placeholder='Ingeniero, Gerente, etc.'
                  {...register(`contacts.${index}.position`)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Teléfono'
                  placeholder='+58...'
                  {...register(`contacts.${index}.phone`)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Email'
                  placeholder='ejemplo@correo.com'
                  {...register(`contacts.${index}.email`)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Notas'
                  placeholder='Detalles relevantes, observaciones...'
                  {...register(`contacts.${index}.notes`)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Box display='flex' alignItems='center' justifyContent='flex-end' gap={1} height='100%'>
                  <IconButton onClick={() => handleDeleteContact(index)} color='error' size='large'>
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))
      )}
    </Box>
  )
}

export default ContactListFields
