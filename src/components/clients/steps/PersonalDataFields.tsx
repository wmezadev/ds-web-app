'use client'

import { Box, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

interface Props {
  mode?: 'create' | 'edit'
}

const PersonalDataFields: React.FC<Props> = ({ mode = 'create' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <Controller
            name='personal_data.gender'
            control={control}
            rules={{ required: mode === 'create' ? 'El género es requerido' : false }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.gender}>
                <InputLabel>Género</InputLabel>
                <Select {...field} label='Género' value={field.value ?? ''}>
                  <MenuItem value='Masculino'>Masculino</MenuItem>
                  <MenuItem value='Femenino'>Femenino</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name='personal_data.civil_status'
            control={control}
            rules={{ required: mode === 'create' ? 'El estado civil es requerido' : false }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.personal_data?.civil_status}>
                <InputLabel>Estado Civil</InputLabel>
                <Select {...field} label='Estado Civil' value={field.value ?? ''}>
                  <MenuItem value='Soltero'>Soltero</MenuItem>
                  <MenuItem value='Casado'>Casado</MenuItem>
                  <MenuItem value='Divorciado'>Divorciado</MenuItem>
                  <MenuItem value='Viudo'>Viudo</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.height'
            control={control}
            rules={{ required: mode === 'create' ? 'La altura es requerida' : false }}
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
            rules={{ required: mode === 'create' ? 'El peso es requerido' : false }}
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
            rules={{ required: mode === 'create' ? 'El fumador es requerido' : false }}
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
            rules={{ required: mode === 'create' ? 'El deporte es requerido' : false }}
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
            rules={{ required: mode === 'create' ? 'La patología es requerida' : false }}
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
            rules={{ required: mode === 'create' ? 'La profesión es requerida' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Profesión'
                fullWidth
                error={!!errors.personal_data?.profession_id}
                helperText={errors.personal_data?.profession_id?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.occupation_id'
            control={control}
            rules={{ required: mode === 'create' ? 'La ocupación es requerida' : false }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Ocupación'
                fullWidth
                error={!!errors.personal_data?.occupation_id}
                helperText={errors.personal_data?.occupation_id?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name='personal_data.monthly_income'
            control={control}
            rules={{ required: mode === 'create' ? 'El ingreso es requerido' : false }}
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
            rules={{ required: mode === 'create' ? 'El rif es requerido' : false }}
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
