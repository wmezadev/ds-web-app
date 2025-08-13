'use client'

import React from 'react'

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
import { Close, Check } from '@mui/icons-material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'
import { useCities } from '@/hooks/useCities'

interface Props {
  mode?: 'create' | 'edit'
}

const ClientInfoFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()
  
  const { cities, loading: citiesLoading } = useCities()

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
                  <MenuItem value='natural'>Natural</MenuItem>
                  <MenuItem value='jurídica'>Jurídica</MenuItem>
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
                <InputLabel>Tipo</InputLabel>
                <Select {...field} label='Tipo' value={field.value ?? ''}>
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
                label='Número de Documento'
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
                <Select 
                  {...field} 
                  label='Ciudad de Residencia' 
                  value={field.value ?? ''}
                  disabled={citiesLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar ciudad</em>
                  </MenuItem>
                  {cities.map((city) => (
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
                defaultValue='cliente'
                rules={{ required: mode === 'create' ? 'El tipo de fuente es requerido' : false }}
                render={({ field }) => (
                  <ToggleButtonGroup
                    exclusive
                    value={field.value ?? 'cliente'}
                    onChange={(_, value) => field.onChange(value)}
                    size='small'
                    fullWidth
                  >
                    <ToggleButton value='cliente' color='primary'>
                      Cliente
                    </ToggleButton>
                    <ToggleButton value='prospecto' color='warning'>
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
