'use client'

import React, { useState } from 'react'

import { Box, Typography, TextField, Paper, Button, Stack } from '@mui/material'

import { useApi } from '@/hooks/useApi'

const initialState = {
  full_name: '',
  document_number: '',
  birthdate: '',
  nationality: '',
  doc: null as File | null
}

type FormFields = {
  full_name: string
  document_number: string
  birthdate: string
  nationality: string
  doc: File | null
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const ClientCreatePage = () => {
  const [form, setForm] = useState<FormFields>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const { fetchApi, uploadFile } = useApi()

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

    /*     if (!form.name) errs.name = 'Nombre requerido'
    if (!form.email) errs.email = 'Email requerido'
    if (!form.phone) errs.phone = 'Teléfono requerido'
 */
    // Optionally require doc
    // if (!form.doc) errs.doc = 'Documento requerido'
    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      if (form.doc) {
        const file = await uploadFile('aws/s3/upload', form.doc)

        const data = await fetchApi('clients/extract-data', {
          method: 'POST',
          body: {
            s3_key: file?.key,
            document_type: 'cedula'
          }
        })

        if (data?.fields) {
          setForm(prev => ({
            ...prev,
            full_name: data.fields.full_name || '',
            document_number: data.fields.document_number || '',
            birthdate: data.fields.birthdate || '',
            nationality: data.fields.nationality || ''
          }))
        }
      } else {
        // Optionally handle case where no file is selected
        console.warn('No file selected for upload')
      }
    } catch (err) {
      console.error(err)
    }
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
              label='Nombre completo'
              name='full_name'
              value={form.full_name}
              onChange={handleChange}
              error={!!errors.full_name}
              helperText={errors.full_name}
              fullWidth
              required
            />
            <TextField
              label='Número de documento'
              name='document_number'
              value={form.document_number}
              onChange={handleChange}
              error={!!errors.document_number}
              helperText={errors.document_number}
              fullWidth
              required
            />
            <TextField
              label='Fecha de nacimiento'
              name='birthdate'
              value={form.birthdate}
              onChange={handleChange}
              error={!!errors.birthdate}
              helperText={errors.birthdate}
              fullWidth
              required
              placeholder='DD-MM-YY'
            />
            <TextField
              label='Nacionalidad'
              name='nationality'
              value={form.nationality}
              onChange={handleChange}
              error={!!errors.nationality}
              helperText={errors.nationality}
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
