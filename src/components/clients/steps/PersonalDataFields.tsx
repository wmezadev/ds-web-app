'use client'

import { Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'
import LegalDataFields from './LegalDataFields'
import { useCatalogs } from '@/hooks/useCatalogs'

interface Props {
  mode?: 'create' | 'edit'
}

const PersonalDataFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors },
    watch
  } = useFormContext<ClientFormFields>()

  const { catalogs } = useCatalogs()

  const personType = watch('person_type')

  // Render legal data fields for J person type
  if (personType === 'J') {
    return <LegalDataFields mode={mode} />
  }

  // Render personal data fields for natural person type (default)
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <Controller
            name='personal_data.gender'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.gender}>
                <InputLabel>Género</InputLabel>
                <Select {...field} label='Género' value={field.value ?? ''}>
                  <MenuItem value='M'>Masculino</MenuItem>
                  <MenuItem value='F'>Femenino</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name='personal_data.civil_status'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.civil_status}>
                <InputLabel>Estado Civil</InputLabel>
                <Select {...field} label='Estado Civil' value={field.value ?? ''}>
                  <MenuItem value='S'>Soltero</MenuItem>
                  <MenuItem value='C'>Casado</MenuItem>
                  <MenuItem value='D'>Divorciado</MenuItem>
                  <MenuItem value='V'>Viudo</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.height'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Altura (cm)'
                type='number'
                fullWidth
                error={!!errors.personal_data?.height}
                helperText={errors.personal_data?.height?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.weight'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Peso (kg)'
                type='number'
                fullWidth
                error={!!errors.personal_data?.weight}
                helperText={errors.personal_data?.weight?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controller
            name='personal_data.smoker'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.smoker}>
                <InputLabel>Fumador</InputLabel>
                <Select {...field} label='Fumador' value={field.value ?? ''}>
                  <MenuItem value='Si'>Si</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name='personal_data.sports'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.sports}>
                <InputLabel>Deporte</InputLabel>
                <Select {...field} label='Deporte' value={field.value ?? ''}>
                  <MenuItem value='Si'>Si</MenuItem>
                  <MenuItem value='No'>No</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='personal_data.pathology'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Patología'
                fullWidth
                error={!!errors.personal_data?.pathology}
                helperText={errors.personal_data?.pathology?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.profession_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.profession_id}>
                <InputLabel>Profesión</InputLabel>
                <Select {...field} label='Profesión' value={field.value ?? ''}>
                  {(catalogs?.client_professions || []).map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.occupation_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.occupation_id}>
                <InputLabel>Ocupación</InputLabel>
                <Select {...field} label='Ocupación' value={field.value ?? ''}>
                  {(catalogs?.client_occupations || []).map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.monthly_income'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Ingreso'
                fullWidth
                error={!!errors.personal_data?.monthly_income}
                helperText={errors.personal_data?.monthly_income?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.rif'
            control={control}
            rules={{ required: 'El rif es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                label='RIF'
                fullWidth
                error={!!errors.personal_data?.rif}
                helperText={errors.personal_data?.rif?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PersonalDataFields
