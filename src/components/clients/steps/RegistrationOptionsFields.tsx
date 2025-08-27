'use client'

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'
import { useCatalogs } from '@/hooks/useCatalogs'
// Risk variables will be taken from useCatalogs()

const RegistrationOptionsFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  // Fetch all catalog data
  const { catalogs, loading: loadingCatalogs } = useCatalogs()

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Opciones de Registro
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_category_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_category_id}>
                <InputLabel>Categoría de Cliente</InputLabel>
                <Select {...field} label='Categoría de Cliente' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar categoría</em>
                  </MenuItem>
                  {catalogs?.client_categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando categorías...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='office_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.office_id}>
                <InputLabel>Oficina</InputLabel>
                <Select {...field} label='Oficina' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar oficina</em>
                  </MenuItem>
                  {catalogs?.offices.map(office => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando oficinas...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Agent and Executive */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='agent_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.agent_id}>
                <InputLabel>Agente</InputLabel>
                <Select {...field} label='Agente' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar agente</em>
                  </MenuItem>
                  {catalogs?.agents.map(agent => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando agentes...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='executive_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.executive_id}>
                <InputLabel>Ejecutivo</InputLabel>
                <Select {...field} label='Ejecutivo' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar ejecutivo</em>
                  </MenuItem>
                  {catalogs?.executives.map(executive => (
                    <MenuItem key={executive.id} value={executive.id}>
                      {executive.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando ejecutivos...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Group and Branch */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_group_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_group_id}>
                <InputLabel>Grupo de Cliente</InputLabel>
                <Select {...field} label='Grupo de Cliente' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar grupo</em>
                  </MenuItem>
                  {catalogs?.client_groups.map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando grupos...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_branch_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_branch_id}>
                <InputLabel>Sucursal de Cliente</InputLabel>
                <Select {...field} label='Sucursal de Cliente' value={field.value ?? ''} disabled={loadingCatalogs}>
                  <MenuItem value=''>
                    <em>Seleccionar sucursal</em>
                  </MenuItem>
                  {catalogs?.client_branches.map(branch => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando sucursales...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Variables de Riesgo (multiselect) */}
        <Grid item xs={12}>
          <Controller
            name='risk_variables'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Variables de riesgo</InputLabel>
                <Select
                  {...field}
                  multiple
                  label='Variables de riesgo'
                  value={Array.isArray(field.value) ? field.value : []}
                  disabled={loadingCatalogs}
                  renderValue={selected =>
                    (selected as (string | number)[])
                      .map(v => {
                        const item = catalogs?.risk_variables.find(rv => rv.id === Number(v)) as any
                        return item?.name || item?.description || item?.code || v
                      })
                      .join(', ')
                  }
                >
                  {catalogs?.risk_variables.map((rv: any) => (
                    <MenuItem key={rv.id} value={rv.id}>
                      {rv.name || rv.description || rv.code}
                    </MenuItem>
                  ))}
                </Select>
                {loadingCatalogs && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando variables de riesgo...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Notas (Opcional)'
                multiline
                rows={3}
                fullWidth
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegistrationOptionsFields
