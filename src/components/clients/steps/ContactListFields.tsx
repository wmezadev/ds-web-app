'use client'

import { useState, useEffect } from 'react'

import { Box, Grid, IconButton, Stack, TextField, Typography, Button, Alert } from '@mui/material'
import { Add, Delete, Save } from '@mui/icons-material'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import { API_ROUTES } from '@/constants/routes'
import { clientFormToApi, type ClientFormFields } from '../ClientForm'

const ContactListFields = () => {
  const { control, register, getValues } = useFormContext<ClientFormFields>()
  const { fetchApi } = useApi()
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [localSaves, setLocalSaves] = useState<Set<number>>(new Set())

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

  const handleSaveContact = (index: number) => {
    const formData = getValues()
    const contactData = formData.contacts?.[index]

    // Validate required fields
    if (!contactData?.full_name || !contactData?.email || !contactData?.phone) {
      setSaveMessage('Por favor complete los campos requeridos (Nombre completo, Email y Teléfono)')
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactData.email)) {
      setSaveMessage('Por favor ingrese un email válido (ejemplo@dominio.com)')
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }

    // Clean and save to localStorage immediately
    const cleanContactData = {
      full_name: contactData.full_name.trim(),
      position: contactData.position?.trim() || '',
      phone: contactData.phone.trim(),
      email: contactData.email.trim().toLowerCase(),
      notes: contactData.notes?.trim() || ''
    }

    // Update the contact in the form
    update(index, cleanContactData)
    
    // Save all contacts to localStorage
    const allContacts = formData.contacts || []
    allContacts[index] = cleanContactData
    saveToLocalStorage(allContacts)
    
    // Mark as locally saved
    setLocalSaves(prev => new Set([...prev, index]))
    
    setSaveMessage('💾 Contacto guardado localmente')
    setTimeout(() => setSaveMessage(null), 2000)
    
    console.log('[ContactListFields] Contact saved to localStorage:', cleanContactData)
  }



  const getButtonProps = (index: number) => {
    if (localSaves.has(index)) {
      return {
        text: 'Guardado',
        color: '#4caf50',
        disabled: false,
        icon: <Save />
      }
    }
    
    return {
      text: 'Guardar',
      color: '#2196f3',
      disabled: false,
      icon: <Save />
    }
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

      {/* Success/Error Message */}
      {saveMessage && (
        <Alert severity={saveMessage.includes('exitosamente') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {saveMessage}
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
                  {(() => {
                    const buttonProps = getButtonProps(index)
                    return (
                      <Button
                        variant='contained'
                        onClick={() => handleSaveContact(index)}
                        startIcon={buttonProps.icon}
                        disabled={buttonProps.disabled}
                        sx={{
                          backgroundColor: buttonProps.color,
                          '&:hover': {
                            backgroundColor: buttonProps.color,
                            opacity: 0.8
                          },
                          minWidth: '120px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {buttonProps.text}
                      </Button>
                    )
                  })()}
                  <IconButton onClick={() => remove(index)} color='error' size='large'>
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
