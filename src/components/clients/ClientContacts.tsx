'use client'

import { useState } from 'react'

import { Box, Grid, IconButton, Stack, TextField, Typography, Button, Alert, Snackbar } from '@mui/material'
import { Add, Delete, Save } from '@mui/icons-material'
import { useFieldArray, useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import type { Client } from '@/types/client'

interface ClientContactsProps {
  client: Client
  refreshClient: () => Promise<void>
}

interface ContactFormFields {
  contacts: {
    id?: number
    full_name: string
    position: string
    phone: string
    email: string
    notes: string | null
  }[]
}

const ClientContacts: React.FC<ClientContactsProps> = ({ client, refreshClient }) => {
  const { control, register, handleSubmit } = useForm<ContactFormFields>({
    defaultValues: {
      contacts: client.contacts || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  })

  const { fetchApi } = useApi()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
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

  const onSubmit = async (data: ContactFormFields) => {
    setIsSubmitting(true)

    // We need to send the whole client object back, not just contacts.
    const payload = {
      ...client,
      ...client.personal_data,
      ...client.legal_data,
      contacts: data.contacts.map(c => ({ ...c, id: c.id || undefined }))
    }

    // The API expects certain fields to be null if empty, and others to be numbers.
    // This is a simplified payload construction. For a real app, we'd use a utility
    // function like the one in ClientForm.tsx to ensure data integrity.

    try {
      await fetchApi(`clients/${client.id}`, {
        method: 'PUT',
        body: payload
      })

      setSnackbar({ open: true, message: 'Contactos actualizados con éxito', severity: 'success' })
      await refreshClient()
    } catch (error) {
      console.error('Error updating contacts:', error)
      setSnackbar({ open: true, message: 'Error al actualizar los contactos', severity: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6'>Contactos</Typography>
          <Box>
            <Button variant='outlined' onClick={handleAddContact} startIcon={<Add />}>
              Nuevo Contacto
            </Button>
            <Button type='submit' variant='contained' startIcon={<Save />} sx={{ ml: 2 }} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Stack>

        {fields.length === 0 ? (
          <Typography variant='body2' color='text.secondary'>
            No hay contactos añadidos aún.
          </Typography>
        ) : (
          fields.map((field, index) => (
            <Box key={field.id} mb={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='Nombre Completo' {...register(`contacts.${index}.full_name`)} required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label='Posición/Cargo' {...register(`contacts.${index}.position`)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='Teléfono' {...register(`contacts.${index}.phone`)} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label='Email' type='email' {...register(`contacts.${index}.email`)} required />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField fullWidth label='Notas' {...register(`contacts.${index}.notes`)} />
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton onClick={() => remove(index)} color='error'>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ClientContacts
