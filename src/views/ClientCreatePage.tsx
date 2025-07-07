'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, TextField, Paper, Button, Stack } from '@mui/material'

const initialState = {
  name: '',
  email: '',
  phone: '',
  doc: null as File | null
}

type FormFields = {
  name: string
  email: string
  phone: string
  doc: File | null
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const ClientCreatePage = () => {
  const [form, setForm] = useState<FormFields>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target

    if (name === 'doc' && files) {
      setForm({ ...form, doc: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const validate = () => {
    const errs: any = {}

    if (!form.name) errs.name = 'Nombre requerido'
    if (!form.email) errs.email = 'Email requerido'
    if (!form.phone) errs.phone = 'Teléfono requerido'

    // Optionally require doc
    // if (!form.doc) errs.doc = 'Documento requerido'
    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // TODO: Replace with real API call
    alert('Cliente creado!')

    router.push('/clients')
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 500, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
          Crear cliente
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label='Nombre'
              name='name'
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              label='Email'
              name='email'
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
              type='email'
            />
            <TextField
              label='Teléfono'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              required
            />
            <Button variant='outlined' component='label' color={form.doc ? 'success' : 'primary'}>
              {form.doc ? `Archivo: ${form.doc.name}` : 'Subir documento'}
              <input type='file' name='doc' accept='.pdf,.jpg,.jpeg,.png' hidden onChange={handleChange} />
            </Button>
            <Button type='submit' variant='contained' color='primary' size='large'>
              Crear cliente
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default ClientCreatePage
