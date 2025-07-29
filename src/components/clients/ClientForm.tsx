'use client'

import React, { useRef } from 'react'

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
  Checkbox
} from '@mui/material'

import type { Client } from '@/types/client'

export interface ClientFormFields {
  is_member_of_group?: boolean | null
  client_type?: 'V' | 'E' | 'J' | string | null
  document_number: string
  first_name?: string | null
  last_name?: string | null
  birth_place?: string | null
  birth_date?: string | null
  person_type?: 'N' | 'J' | string | null
  status?: boolean | null
  source?: 'C' | 'P' | string | null
  email_1?: string | null
  email_2?: string | null
  phone?: string | null
  mobile_1?: string | null
  mobile_2?: string | null
  billing_address?: string | null
  city_id?: number | string | null
  zone_id?: number | string | null
  reference?: string | null
  client_category_id?: number | string | null
  office_id?: number | string | null
  agent_id?: number | string | null
  executive_id?: number | string | null
  client_group_id?: number | string | null
  client_branch_id?: number | string | null
  join_date?: string | null
  notes?: string | null
  doc?: File | null
}

const defaultValues: ClientFormFields = {
  is_member_of_group: false,
  client_type: 'V',
  document_number: '',
  first_name: '',
  last_name: '',
  birth_place: '',
  birth_date: '',
  person_type: 'N',
  status: true,
  source: 'C',
  email_1: '',
  email_2: '',
  phone: '',
  mobile_1: '',
  mobile_2: '',
  billing_address: '',
  city_id: '',
  zone_id: '',
  reference: '',
  client_category_id: '',
  office_id: '',
  agent_id: '',
  executive_id: '',
  client_group_id: '',
  client_branch_id: '',
  join_date: new Date().toISOString().split('T')[0],
  notes: '',
  doc: null
}

export type ClientFormMode = 'create' | 'edit' | 'view'

interface ClientFormProps {
  mode?: ClientFormMode
  initialValues?: Partial<ClientFormFields>
  onSubmit?: (values: ClientFormFields) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  title?: string
}

export function clientApiToForm(client: Client): ClientFormFields {
  return {
    is_member_of_group: (client as any).is_member_of_group ?? false,
    client_type: client.client_type ?? 'V',
    document_number: client.document_number ?? '',
    first_name: client.first_name ?? '',
    last_name: client.last_name ?? '',
    birth_place: client.birth_place ?? '',
    birth_date: client.birth_date ?? '',
    person_type: client.person_type ?? 'N',
    status: client.status ?? true,
    source: (client as any).source ?? 'C',
    email_1: client.email_1 ?? '',
    email_2: client.email_2 ?? '',
    phone: client.phone ?? '',
    mobile_1: client.mobile_1 ?? '',
    mobile_2: client.mobile_2 ?? '',
    billing_address: client.billing_address ?? '',
    city_id: client.city_id ?? '',
    zone_id: client.zone_id ?? '',
    reference: client.reference ?? '',
    client_category_id: client.client_category_id ?? '',
    office_id: client.office_id ?? '',
    agent_id: client.agent_id ?? '',
    executive_id: client.executive_id ?? '',
    client_group_id: client.client_group_id ?? '',
    client_branch_id: client.client_branch_id ?? '',
    join_date: client.join_date ?? '',
    notes: client.notes ?? '',
    doc: null
  }
}

export function clientFormToApi(formData: ClientFormFields): Partial<Client> {
  const apiPayload: Partial<Client> = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    document_number: formData.document_number,
    email_1: formData.email_1,
    mobile_1: formData.mobile_1,
    status: formData.status === null ? undefined : formData.status,
    birth_date: formData.birth_date,
    join_date: formData.join_date,
    client_type: formData.client_type ?? undefined,
    person_type: formData.person_type,
    is_member_of_group: formData.is_member_of_group,
    phone: formData.phone,
    email_2: formData.email_2,
    mobile_2: formData.mobile_2,
    billing_address: formData.billing_address,
    reference: formData.reference,
    birth_place: formData.birth_place,

    city_id: formData.city_id ? Number(formData.city_id) : null,
    zone_id: formData.zone_id ? Number(formData.zone_id) : null,
    client_category_id: formData.client_category_id ? Number(formData.client_category_id) : null,
    office_id: formData.office_id ? Number(formData.office_id) : null,
    agent_id: formData.agent_id ? Number(formData.agent_id) : null,
    executive_id: formData.executive_id ? Number(formData.executive_id) : null,
    client_group_id: formData.client_group_id ? Number(formData.client_group_id) : null,
    client_branch_id: formData.client_branch_id ? Number(formData.client_branch_id) : null,
    notes: formData.notes
  }

  Object.keys(apiPayload).forEach(key => {
    if ((apiPayload as any)[key] === '' || (apiPayload as any)[key] === null) {
      delete (apiPayload as any)[key]
    }
  })

  return apiPayload
}

function validate(values: ClientFormFields) {
  const errs: Partial<Record<keyof ClientFormFields, string>> = {}

  if (!values.document_number?.trim()) errs.document_number = 'Campo requerido'
  if (!values.first_name?.trim()) errs.first_name = 'Campo requerido'
  if (!values.mobile_1?.trim()) errs.mobile_1 = 'Teléfono móvil es requerido'

  if (values.email_1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email_1)) {
    errs.email_1 = 'Correo electrónico no válido'
  }

  if (values.email_2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email_2)) {
    errs.email_2 = 'Correo electrónico no válido'
  }

  return errs
}

const nv = (v: unknown): string | number => (v === null || v === undefined ? '' : (v as any))

const ClientForm: React.FC<ClientFormProps> = ({
  mode = 'create',
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel,
  title
}) => {
  const [values, setValues] = React.useState<ClientFormFields>(() => ({
    ...defaultValues,
    ...initialValues
  }))

  const [errors, setErrors] = React.useState<Partial<Record<keyof ClientFormFields, string>>>({})

  const readOnly = mode === 'view'

  const hasInitialized = useRef(false)

  React.useEffect(() => {
    if (!hasInitialized.current && initialValues) {
      setValues({ ...defaultValues, ...initialValues })
      setErrors({})
      hasInitialized.current = true
    }
  }, [initialValues])

  const handleFieldChange =
    (field: keyof ClientFormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
      const target = e.target as HTMLInputElement
      const { type, value, checked } = target

      setValues(prev => ({
        ...prev,
        [field]: type === 'checkbox' ? checked : value
      }))

      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return // No enviar si está en modo solo lectura

    const errs = validate(values)

    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    await onSubmit?.(values) // Llama a la función onSubmit pasada por el padre
  }

  const resolvedTitle =
    title || (mode === 'view' ? 'Detalles del Cliente' : mode === 'edit' ? 'Editar Cliente' : 'Crear Nuevo Cliente')

  const resolvedSubmitLabel = submitLabel || (mode === 'edit' ? 'Actualizar Cliente' : 'Guardar Cliente')

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
          {resolvedTitle}
        </Typography>

        {/* submitError no se muestra aquí por ahora */}

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={4}>
            {/* -------------------------------------- */}
            {/* Información Básica                     */}
            {/* -------------------------------------- */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Información Básica
              </Typography>

              <Stack spacing={3}>
                {/* Tipo persona + Origen */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Tipo de Persona'
                    name='person_type'
                    select
                    value={nv(values.person_type)}
                    onChange={handleFieldChange('person_type')}
                    fullWidth
                    disabled={readOnly}
                    SelectProps={{ native: true }}
                  >
                    <option value='N'>Natural</option>
                    <option value='J'>Jurídica</option>
                  </TextField>

                  <TextField
                    label='Origen'
                    name='source'
                    select
                    value={nv(values.source)}
                    onChange={handleFieldChange('source')}
                    fullWidth
                    disabled={readOnly}
                    SelectProps={{ native: true }}
                  >
                    <option value='C'>Cliente</option>
                    <option value='P'>Prospecto</option>
                  </TextField>
                </Stack>

                {/* Tipo doc + Número */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems='flex-end'>
                  <TextField
                    label='Tipo de Documento'
                    name='client_type'
                    select
                    value={nv(values.client_type)}
                    onChange={handleFieldChange('client_type')}
                    sx={{ width: { xs: '100%', md: '30%' } }}
                    disabled={readOnly}
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
                    value={nv(values.document_number)}
                    onChange={handleFieldChange('document_number')}
                    error={!!errors.document_number}
                    helperText={errors.document_number}
                    required
                    sx={{ width: { xs: '100%', md: '70%' } }}
                    disabled={readOnly}
                  />
                </Stack>

                {/* Nombre + Apellido */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Nombres'
                    name='first_name'
                    value={nv(values.first_name)}
                    onChange={handleFieldChange('first_name')}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                    disabled={readOnly}
                  />

                  <TextField
                    label='Apellidos'
                    name='last_name'
                    value={nv(values.last_name)}
                    onChange={handleFieldChange('last_name')}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                    disabled={readOnly}
                  />
                </Stack>

                {/* Fecha Nac + Lugar Nac */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Fecha de Nacimiento'
                    name='birth_date'
                    type='date'
                    value={nv(values.birth_date)}
                    onChange={handleFieldChange('birth_date')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={readOnly}
                  />

                  <TextField
                    label='Lugar de Nacimiento'
                    name='birth_place'
                    value={nv(values.birth_place)}
                    onChange={handleFieldChange('birth_place')}
                    fullWidth
                    disabled={readOnly}
                  />
                </Stack>

                {/* Fecha Ingreso + Grupo */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems='center'>
                  <TextField
                    label='Fecha de Ingreso'
                    name='join_date'
                    type='date'
                    value={nv(values.join_date)}
                    onChange={handleFieldChange('join_date')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    disabled={readOnly}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name='is_member_of_group'
                        checked={!!values.is_member_of_group}
                        onChange={handleFieldChange('is_member_of_group')}
                        color='primary'
                        disabled={readOnly}
                      />
                    }
                    label='¿Pertenece a un grupo?'
                    sx={{ ml: { md: 2 } }}
                  />
                </Stack>

                {/* Estado */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant='body2' sx={{ mr: 2, whiteSpace: 'nowrap' }}>
                    Estado:
                  </Typography>
                  <Button
                    variant={values.status ? 'contained' : 'outlined'}
                    color={values.status ? 'success' : 'inherit'}
                    onClick={() => !readOnly && setValues(prev => ({ ...prev, status: true }))}
                    size='small'
                    sx={{ mr: 1 }}
                    disabled={readOnly}
                  >
                    Activo
                  </Button>
                  <Button
                    variant={!values.status ? 'contained' : 'outlined'}
                    color={!values.status ? 'error' : 'inherit'}
                    onClick={() => !readOnly && setValues(prev => ({ ...prev, status: false }))}
                    size='small'
                    disabled={readOnly}
                  >
                    Inactivo
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* -------------------------------------- */}
            {/* Información de Contacto                */}
            {/* -------------------------------------- */}
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
                    value={nv(values.email_1)}
                    onChange={handleFieldChange('email_1')}
                    error={!!errors.email_1}
                    helperText={errors.email_1}
                    fullWidth
                    disabled={readOnly}
                  />

                  <TextField
                    label='Email Secundario'
                    name='email_2'
                    type='email'
                    value={nv(values.email_2)}
                    onChange={handleFieldChange('email_2')}
                    error={!!errors.email_2}
                    helperText={errors.email_2}
                    fullWidth
                    disabled={readOnly}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label='Teléfono Fijo'
                    name='phone'
                    value={nv(values.phone)}
                    onChange={handleFieldChange('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                    disabled={readOnly}
                  />

                  <TextField
                    label='Móvil Principal *'
                    name='mobile_1'
                    value={nv(values.mobile_1)}
                    onChange={handleFieldChange('mobile_1')}
                    error={!!errors.mobile_1}
                    helperText={errors.mobile_1 || 'Requerido'}
                    required
                    fullWidth
                    disabled={readOnly}
                  />
                </Stack>

                <TextField
                  label='Móvil Secundario'
                  name='mobile_2'
                  value={nv(values.mobile_2)}
                  onChange={handleFieldChange('mobile_2')}
                  error={!!errors.mobile_2}
                  helperText={errors.mobile_2}
                  fullWidth
                  disabled={readOnly}
                />
              </Stack>
            </Paper>

            {/* -------------------------------------- */}
            {/* Dirección de Facturación               */}
            {/* -------------------------------------- */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Dirección de Facturación
              </Typography>

              <Stack spacing={3}>
                <TextField
                  label='Dirección Completa'
                  name='billing_address'
                  value={nv(values.billing_address)}
                  onChange={handleFieldChange('billing_address')}
                  fullWidth
                  multiline
                  rows={2}
                  disabled={readOnly}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      name='city_id'
                      value={nv(values.city_id)}
                      onChange={handleFieldChange('city_id')}
                      label='Ciudad'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                      {/* opciones ciudad */}
                    </Select>
                  </FormControl>

                  <TextField
                    label='Zona'
                    name='zone_id'
                    value={nv(values.zone_id)}
                    onChange={handleFieldChange('zone_id')}
                    fullWidth
                    disabled={readOnly}
                  />
                </Stack>

                <TextField
                  label='Referencia'
                  name='reference'
                  value={nv(values.reference)}
                  onChange={handleFieldChange('reference')}
                  fullWidth
                  disabled={readOnly}
                />
              </Stack>
            </Paper>

            {/* -------------------------------------- */}
            {/* Información Adicional                  */}
            {/* -------------------------------------- */}
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Typography variant='h6' sx={{ mb: 3, fontWeight: 500, color: 'primary.main' }}>
                Información Adicional
              </Typography>

              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Categoría de Cliente</InputLabel>
                    <Select
                      name='client_category_id'
                      value={nv(values.client_category_id)}
                      onChange={handleFieldChange('client_category_id')}
                      label='Categoría de Cliente'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Oficina</InputLabel>
                    <Select
                      name='office_id'
                      value={nv(values.office_id)}
                      onChange={handleFieldChange('office_id')}
                      label='Oficina'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Agente</InputLabel>
                    <Select
                      name='agent_id'
                      value={nv(values.agent_id)}
                      onChange={handleFieldChange('agent_id')}
                      label='Agente'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Ejecutivo</InputLabel>
                    <Select
                      name='executive_id'
                      value={nv(values.executive_id)}
                      onChange={handleFieldChange('executive_id')}
                      label='Ejecutivo'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Grupo de Cliente</InputLabel>
                    <Select
                      name='client_group_id'
                      value={nv(values.client_group_id)}
                      onChange={handleFieldChange('client_group_id')}
                      label='Grupo de Cliente'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={readOnly}>
                    <InputLabel>Sucursal</InputLabel>
                    <Select
                      name='client_branch_id'
                      value={nv(values.client_branch_id)}
                      onChange={handleFieldChange('client_branch_id')}
                      label='Sucursal'
                    >
                      <MenuItem value=''>
                        <em>Seleccionar</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  label='Notas Adicionales'
                  name='notes'
                  value={nv(values.notes)}
                  onChange={handleFieldChange('notes')}
                  fullWidth
                  multiline
                  rows={3}
                  disabled={readOnly}
                />
              </Stack>
            </Paper>

            {/* -------------------------------------- */}
            {/* Botones                              */}
            {/* -------------------------------------- */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {onCancel && (
                <Button variant='outlined' color='inherit' onClick={onCancel}>
                  {readOnly ? 'Volver' : 'Cancelar'}
                </Button>
              )}
              {!readOnly && (
                <Button type='submit' variant='contained' color='primary'>
                  {resolvedSubmitLabel}
                </Button>
              )}
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default ClientForm
