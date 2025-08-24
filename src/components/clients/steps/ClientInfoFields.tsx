'use client'

import React, { useEffect, useMemo, useRef } from 'react'

import {
  TextField,
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material'

import { Controller, useFormContext } from 'react-hook-form'

import { useDebounce } from '@/hooks/useDebounce'
import { useApi } from '@/hooks/useApi'

import type { ClientFormFields } from '../ClientForm'
import { useCatalogs } from '@/hooks/useCatalogs'

interface Props {
  mode?: 'create' | 'edit'
}

const ClientInfoFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    getValues
  } = useFormContext<ClientFormFields>()

  const { catalogs, loading: citiesLoading } = useCatalogs()
  const { fetchApi } = useApi()

  // Watch fields needed for existence check
  const clientType = watch('client_type')
  const documentNumber = watch('document_number')

  // Holds original values for edit mode
  const originalRef = useRef<{ ct: string; dn: string } | null>(null)

  const debouncedQuery = useDebounce(
    useMemo(() => ({ clientType, documentNumber }), [clientType, documentNumber]),
    400
  )

  // Initialize original values once in edit mode
  useEffect(() => {
    if (mode !== 'edit') return

    if (!originalRef.current) {
      const v = getValues()

      originalRef.current = { ct: v?.client_type ?? '', dn: v?.document_number ?? '' }
    }
  }, [mode, getValues])

  // Check client existence when both fields are present
  useEffect(() => {
    const { clientType: ct, documentNumber: dn } = debouncedQuery || {}

    // Require both values
    if (!ct || !dn) {
      clearErrors('document_number')

      return
    }

    // In edit mode, skip check if unchanged
    const orig = originalRef.current

    if (mode === 'edit' && orig && orig.ct === ct && orig.dn === dn) {
      clearErrors('document_number')

      return
    }

    let cancelled = false

    const run = async () => {
      try {
        const url = `clients/exists?client_type=${encodeURIComponent(ct)}&document_number=${encodeURIComponent(dn)}`
        const { exists } = await fetchApi<{ exists: boolean }>(url)

        if (!cancelled) {
          if (Boolean(exists)) {
            setError('document_number', {
              type: 'manual',
              message: 'Ya existe un cliente con este tipo y número de documento.'
            })
          } else {
            clearErrors('document_number')
          }
        }
      } catch (e: any) {
        // If API fails, do not block; just clear manual error
        if (!cancelled) clearErrors('document_number')
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, mode, fetchApi, setError, clearErrors])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='first_name'
            control={control}
            rules={{ required: mode === 'create' ? 'El nombre es requerido' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Nombre'
                fullWidth
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='last_name'
            control={control}
            rules={{ required: mode === 'create' ? 'El apellido es requerido' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Apellido'
                fullWidth
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            )}
          />
        </Grid>

        {/* Person Type */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='person_type'
            control={control}
            rules={{ required: 'El tipo de persona es requerido' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.person_type}>
                <InputLabel>Tipo de Persona</InputLabel>
                <Select {...field} label='Tipo de Persona' value={field.value ?? ''}>
                  <MenuItem value='N'>Natural</MenuItem>
                  <MenuItem value='J'>Jurídico</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Client Type and Document Number */}
        <Grid item xs={4} sm={2}>
          <Controller
            name='client_type'
            control={control}
            defaultValue=''
            rules={{ required: mode === 'create' ? 'El tipo de cliente es requerido' : false }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_type}>
                <InputLabel>Tipo Documento</InputLabel>
                <Select {...field} label='Tipo' value={field.value ?? ''} defaultValue='V'>
                  <MenuItem value='V'>V</MenuItem>
                  <MenuItem value='J'>J</MenuItem>
                  <MenuItem value='E'>E</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={8} sm={4}>
          <Controller
            name='document_number'
            control={control}
            rules={{ required: mode === 'create' ? 'El número de documento es requerido' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Número de Documento (C.I., RIF, Pasaporte...)'
                error={!!errors.document_number}
                helperText={errors.document_number?.message}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='city_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.city_id}>
                <InputLabel>Ciudad de Residencia</InputLabel>
                <Select {...field} label='Ciudad de Residencia' value={field.value ?? ''} disabled={citiesLoading}>
                  <MenuItem value=''>
                    <em>Seleccionar ciudad</em>
                  </MenuItem>
                  {catalogs?.cities.map(city => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {citiesLoading && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando ciudades...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Birth Place and Birth Date */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='birth_place'
            control={control}
            rules={{ required: mode === 'create' ? 'El lugar de nacimiento es requerido' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Lugar de Nacimiento'
                fullWidth
                error={!!errors.birth_place}
                helperText={errors.birth_place?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='birth_date'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Fecha de Nacimiento'
                type='date'
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.birth_date}
                helperText={errors.birth_date?.message}
              />
            )}
          />
        </Grid>

        {/* Join Date */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='join_date'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Fecha de Ingreso'
                type='date'
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.join_date}
                helperText={errors.join_date?.message}
              />
            )}
          />
        </Grid>

        {/* Source + Miembro */}
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant='subtitle2' gutterBottom>
                Origen
              </Typography>
              <Controller
                name='source'
                control={control}
                defaultValue='C'
                rules={{ required: mode === 'create' ? 'El tipo de fuente es requerido' : false }}
                render={({ field }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={field.value ?? 'C'}
                    onChange={(_, value) => field.onChange(value)}
                    size='small'
                    fullWidth
                  >
                    <ToggleButton value='C' color='primary'>
                      Cliente
                    </ToggleButton>
                    <ToggleButton value='P' color='warning'>
                      Prospecto
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display='flex' justifyContent='flex-start' alignItems='flex-end'>
              <Box>
                <Typography variant='subtitle2' gutterBottom>
                  ¿Miembro de Grupo?
                </Typography>
                <Controller
                  name='is_member_of_group'
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      exclusive
                      value={field.value ?? ''}
                      onChange={(_, value) => field.onChange(value)}
                      size='small'
                    >
                      <ToggleButton value='yes' color='primary'>
                        Sí
                      </ToggleButton>
                      <ToggleButton value='no' color='secondary'>
                        No
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Hidden ID */}
        <Controller name='id' control={control} render={({ field }) => <input type='hidden' {...field} />} />
      </Grid>
    </Box>
  )
}

export default ClientInfoFields
