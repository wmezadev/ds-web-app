'use client'

import React from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material'

import { useApi } from '@/hooks/useApi'

interface ClientFormFields {
  // Basic Information
  is_member_of_group?: boolean
  client_type?: 'V' | 'E' | 'J' | string // V/E/J/etc
  document_number: string // required
  first_name?: string
  last_name?: string
  birth_place?: string
  birth_date?: string // date
  person_type?: 'N' | 'J' // N: Natural, J: Jurídico
  status?: boolean
  source?: 'C' | 'P' // C: Cliente, P: Prospecto

  // Contact Information
  email_1?: string
  email_2?: string
  phone?: string
  mobile_1?: string
  mobile_2?: string

  // Address Information
  billing_address?: string
  city_id?: number
  zone_id?: number
  reference?: string

  // Business Information
  client_category_id?: number
  office_id?: number
  agent_id?: number
  executive_id?: number
  client_group_id?: number
  client_branch_id?: number

  // Additional Information
  join_date?: string // date
  notes?: string

  // Para carga de documentos
  doc?: File | null
}

const initialState: ClientFormFields = {
  is_member_of_group: false,
  client_type: 'V', // Default to 'V'
  document_number: '',
  first_name: '',
  last_name: '',
  birth_place: '',
  birth_date: '',
  person_type: 'N', // Default to 'N' (Natural)
  status: true, // Default to active
  source: 'C', // Default to Cliente
  email_1: '',
  email_2: '',
  phone: '',
  mobile_1: '',
  mobile_2: '',
  billing_address: '',
  city_id: undefined,
  zone_id: undefined,
  reference: '',
  client_category_id: undefined,
  office_id: undefined,
  agent_id: undefined,
  executive_id: undefined,
  client_group_id: undefined,
  client_branch_id: undefined,
  join_date: new Date().toISOString().split('T')[0], // Today's date
  notes: '',
  doc: null
}

type FormErrors = Partial<Record<keyof ClientFormFields, string>>

const ClientCreatePage = () => {
  const [form, setForm] = useState<ClientFormFields>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const { fetchApi, uploadFile } = useApi()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))

    // Limpiar el error del campo cuando se modifica
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const errs: FormErrors = {}

    // Validaciones de información básica
    if (!form.first_name) errs.first_name = 'Campo requerido'
    if (!form.document_number) errs.document_number = 'Campo requerido'

    // Validaciones de contacto
    if (form.email_1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_1)) {
      errs.email_1 = 'Correo electrónico no válido'
    }
    if (form.email_2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_2)) {
      errs.email_2 = 'Correo electrónico no válido'
    }
    if (form.phone && !/^[0-9+\- ]+$/.test(form.phone)) {
      errs.phone = 'Solo números, + y -'
    }
    if (!form.mobile_1) {
      errs.mobile_1 = 'Teléfono móvil es requerido'
    } else if (!/^[0-9+\- ]+$/.test(form.mobile_1)) {
      errs.mobile_1 = 'Solo números, + y -'
    }
    if (form.mobile_2 && !/^[0-9+\- ]+$/.test(form.mobile_2)) {
      errs.mobile_2 = 'Solo números, + y -'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      console.log('Enviando datos del cliente:', form)

      // Prepare the request body with all form fields
      const requestBody = {
        is_member_of_group: form.is_member_of_group,
        client_type: form.client_type,
        document_number: form.document_number,
        first_name: form.first_name,
        last_name: form.last_name,
        birth_place: form.birth_place,
        birth_date: form.birth_date,
        email_1: form.email_1,
        email_2: form.email_2,
        join_date: form.join_date,
        person_type: form.person_type,
        status: form.status,
        // source: form.source,
        billing_address: form.billing_address,
        phone: form.phone,
        mobile_1: form.mobile_1,
        mobile_2: form.mobile_2,
        city_id: form.city_id,
        zone_id: form.zone_id,
        reference: form.reference,
        client_category_id: form.client_category_id,
        office_id: form.office_id,
        agent_id: form.agent_id,
        executive_id: form.executive_id,
        client_group_id: form.client_group_id,
        client_branch_id: form.client_branch_id,
        notes: form.notes
      }

      // Remove undefined values from the request
      const cleanedRequestBody = Object.entries(requestBody).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>
      )

      console.log('Datos a enviar al servidor:', cleanedRequestBody)

      const response = await fetchApi('clients', {
        method: 'POST',
        body: cleanedRequestBody
      })

      console.log('Respuesta del servidor:', response)

      alert('Cliente creado exitosamente')
    } catch (err) {
      console.error('Error al crear el cliente:', err)
      alert('Ocurrió un error al crear el cliente. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
          Crear Nuevo Cliente
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={4}>
            {/* Sección de Información Básica */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Información Básica
              </Typography>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Tipo de Persona'
                    name='person_type'
                    select
                    value={form.person_type}
                    onChange={handleChange}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value='N'>Natural</option>
                    <option value='J'>Jurídica</option>
                  </TextField>

                  <TextField
                    label='Origen'
                    name='source'
                    select
                    value={form.source}
                    onChange={handleChange}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value='C'>Cliente</option>
                    <option value='P'>Prospecto</option>
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems='flex-end'>
                  <TextField
                    label='Tipo de Documento'
                    name='client_type'
                    select
                    value={form.client_type}
                    onChange={handleChange}
                    sx={{ width: '30%' }}
                    SelectProps={{ native: true }}
                  >
                    <option value='V'>V</option>
                    <option value='E'>E</option>
                    <option value='J'>J</option>
                    <option value='P'>P</option>
                    <option value='G'>G</option>
                  </TextField>

                  <TextField
                    label='Número de Documento *'
                    name='document_number'
                    value={form.document_number}
                    onChange={handleChange}
                    error={!!errors.document_number}
                    helperText={errors.document_number}
                    required
                    sx={{ width: '70%' }}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Nombres'
                    name='first_name'
                    value={form.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                  />

                  <TextField
                    label='Apellidos'
                    name='last_name'
                    value={form.last_name}
                    onChange={handleChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Fecha de Nacimiento'
                    name='birth_date'
                    type='date'
                    value={form.birth_date}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    fullWidth
                  />

                  <TextField
                    label='Lugar de Nacimiento'
                    name='birth_place'
                    value={form.birth_place}
                    onChange={handleChange}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems='center'>
                  <TextField
                    label='Fecha de Ingreso'
                    name='join_date'
                    type='date'
                    value={form.join_date}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    fullWidth
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: 1,
                      p: 1,
                      height: 56,
                      '&:hover': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='is_member_of_group'
                          checked={form.is_member_of_group}
                          onChange={handleChange}
                          color='primary'
                        />
                      }
                      label={
                        <Typography variant='body1' sx={{ color: 'text.primary' }}>
                          ¿Pertenece a un grupo?
                        </Typography>
                      }
                      sx={{ m: 0, ml: 1 }}
                    />
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant='body2' sx={{ mr: 2, whiteSpace: 'nowrap' }}>
                    Estado:
                  </Typography>
                  <Button
                    variant={form.status ? 'contained' : 'outlined'}
                    color={form.status ? 'success' : 'inherit'}
                    onClick={() => setForm(prev => ({ ...prev, status: true }))}
                    size='small'
                    sx={{ mr: 1 }}
                  >
                    Activo
                  </Button>
                  <Button
                    variant={!form.status ? 'contained' : 'outlined'}
                    color={!form.status ? 'error' : 'inherit'}
                    onClick={() => setForm(prev => ({ ...prev, status: false }))}
                    size='small'
                  >
                    Inactivo
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Sección de Información de Contacto */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Información de Contacto
              </Typography>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Email Principal'
                    name='email_1'
                    type='email'
                    value={form.email_1}
                    onChange={handleChange}
                    error={!!errors.email_1}
                    helperText={errors.email_1}
                    fullWidth
                  />

                  <TextField
                    label='Email Secundario'
                    name='email_2'
                    type='email'
                    value={form.email_2}
                    onChange={handleChange}
                    error={!!errors.email_2}
                    helperText={errors.email_2}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Teléfono Fijo'
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                  />

                  <TextField
                    label='Móvil Principal *'
                    name='mobile_1'
                    value={form.mobile_1}
                    onChange={handleChange}
                    error={!!errors.mobile_1}
                    helperText={errors.mobile_1 || 'Requerido'}
                    required
                    fullWidth
                  />
                </Stack>

                <TextField
                  label='Móvil Secundario'
                  name='mobile_2'
                  value={form.mobile_2}
                  onChange={handleChange}
                  error={!!errors.mobile_2}
                  helperText={errors.mobile_2}
                  fullWidth
                />
              </Stack>
            </Paper>

            {/* Sección de Dirección */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Dirección de Facturación
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label='Dirección Completa'
                  name='billing_address'
                  value={form.billing_address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      name='city_id'
                      value={form.city_id || ''}
                      onChange={handleChange}
                      label='Ciudad'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your city options here */}
                    </Select>
                  </FormControl>

                  <TextField label='Zona' name='zone_id' value={form.zone_id || ''} onChange={handleChange} fullWidth />
                </Stack>

                <TextField
                  label='Referencia'
                  name='reference'
                  value={form.reference}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
            </Paper>

            {/* Sección de Información Adicional */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Información Adicional
              </Typography>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría de Cliente</InputLabel>
                    <Select
                      name='client_category_id'
                      value={form.client_category_id || ''}
                      onChange={handleChange}
                      label='Categoría de Cliente'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your client category options here */}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Oficina</InputLabel>
                    <Select
                      name='office_id'
                      value={form.office_id || ''}
                      onChange={handleChange}
                      label='Oficina'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your office options here */}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Agente</InputLabel>
                    <Select
                      name='agent_id'
                      value={form.agent_id || ''}
                      onChange={handleChange}
                      label='Agente'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your agent options here */}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Ejecutivo</InputLabel>
                    <Select
                      name='executive_id'
                      value={form.executive_id || ''}
                      onChange={handleChange}
                      label='Ejecutivo'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your executive options here */}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Grupo de Cliente</InputLabel>
                    <Select
                      name='client_group_id'
                      value={form.client_group_id || ''}
                      onChange={handleChange}
                      label='Grupo de Cliente'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your client group options here */}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Sucursal</InputLabel>
                    <Select
                      name='client_branch_id'
                      value={form.client_branch_id || ''}
                      onChange={handleChange}
                      label='Sucursal'
                      IconComponent={() => null}
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* Add your branch options here */}
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  label='Notas Adicionales'
                  name='notes'
                  value={form.notes}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Stack>
            </Paper>

            {/* Botones de Acción */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant='outlined' color='error'>
                Cancelar
              </Button>
              <Button type='submit' variant='contained' color='primary'>
                Guardar Cliente
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default ClientCreatePage
