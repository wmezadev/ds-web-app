'use client'

import { useState } from 'react'

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
  const [savingIndex, setSavingIndex] = useState<number | null>(null)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  })

  const handleAddContact = () => {
    append({
      full_name: '',
      position: '',
      phone: '',
      email: '',
      notes: ''
    })
  }

  const handleSaveContact = async (index: number) => {
    setSavingIndex(index)

    try {
      const formData = getValues()
      const contactData = formData.contacts?.[index]

      // Validate required fields
      if (!contactData?.full_name || !contactData?.email || !contactData?.phone) {
        setSaveMessage('Por favor complete los campos requeridos (Nombre completo, Email y Teléfono)')
        setTimeout(() => setSaveMessage(null), 3000)

        return
      }

      // Check if we're editing an existing client

      if (formData.id) {
        // Update existing client with the new/updated contact
        const apiData = clientFormToApi(formData)

        await fetchApi(API_ROUTES.CLIENTS.UPDATE(formData.id), {
          method: 'PUT',
          body: apiData
        })
        setSaveMessage('Contacto guardado exitosamente en el cliente')

      } else {
        // For new clients, we can't save individual contacts until the client is created
        setSaveMessage('Debe guardar el cliente primero antes de guardar contactos individuales')
      }

      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error('Error saving contact:', error)
      setSaveMessage('Error al guardar el contacto')
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setSavingIndex(null)
    }
  }

  return (
    <Box>
      {/* Header con botón a la derecha */}
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
                  <Button
                    variant='contained'
                    onClick={() => handleSaveContact(index)}
                    startIcon={<Save />}
                    disabled={savingIndex === index}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': {
                        backgroundColor: '#45a049'
                      },
                      minWidth: '120px'
                    }}
                  >
                    {savingIndex === index ? 'Guardando...' : 'Guardar'}
                  </Button>
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
