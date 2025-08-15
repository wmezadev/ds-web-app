'use client'

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'
import { useClientCategories } from '@/hooks/useClientCategories'
import { useOffices } from '@/hooks/useOffices'
import { useAgents } from '@/hooks/useAgents'
import { useClientBranches } from '@/hooks/useClientBranches'
import { useClientGroups } from '@/hooks/useClientGroups'
import { useExecutives } from '@/hooks/useExecutives'

const RegistrationOptionsFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  // Fetch all catalog data
  const { clientCategories, loading: categoriesLoading } = useClientCategories()
  const { offices, loading: officesLoading } = useOffices()
  const { agents, loading: agentsLoading } = useAgents()
  const { clientBranches, loading: branchesLoading } = useClientBranches()
  const { clientGroups, loading: groupsLoading } = useClientGroups()
  const { executives, loading: executivesLoading } = useExecutives()

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Opciones de Registro
      </Typography>
      <Grid container spacing={2}>
        {/* Category and Office */}
        <Grid item xs={12} sm={6}>
          <Controller
            name='client_category_id'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.client_category_id}>
                <InputLabel>Categoría de Cliente</InputLabel>
                <Select 
                  {...field} 
                  label='Categoría de Cliente'
                  value={field.value ?? ''}
                  disabled={categoriesLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar categoría</em>
                  </MenuItem>
                  {clientCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {categoriesLoading && (
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
                <Select 
                  {...field} 
                  label='Oficina'
                  value={field.value ?? ''}
                  disabled={officesLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar oficina</em>
                  </MenuItem>
                  {offices.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.name}
                    </MenuItem>
                  ))}
                </Select>
                {officesLoading && (
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
                <Select 
                  {...field} 
                  label='Agente'
                  value={field.value ?? ''}
                  disabled={agentsLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar agente</em>
                  </MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
                {agentsLoading && (
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
                <Select 
                  {...field} 
                  label='Ejecutivo'
                  value={field.value ?? ''}
                  disabled={executivesLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar ejecutivo</em>
                  </MenuItem>
                  {executives.map((executive) => (
                    <MenuItem key={executive.id} value={executive.id}>
                      {executive.name}
                    </MenuItem>
                  ))}
                </Select>
                {executivesLoading && (
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
                <Select 
                  {...field} 
                  label='Grupo de Cliente'
                  value={field.value ?? ''}
                  disabled={groupsLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar grupo</em>
                  </MenuItem>
                  {clientGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
                {groupsLoading && (
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
                <Select 
                  {...field} 
                  label='Sucursal de Cliente'
                  value={field.value ?? ''}
                  disabled={branchesLoading}
                >
                  <MenuItem value=''>
                    <em>Seleccionar sucursal</em>
                  </MenuItem>
                  {clientBranches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
                {branchesLoading && (
                  <Typography variant='caption' color='textSecondary'>
                    Cargando sucursales...
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Notes */}
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
