'use client'

import { Typography, Grid, Box } from '@mui/material'

import type { Client } from '@/types/client'
import { useCatalogs } from '@/hooks/useCatalogs'

interface DetailItemProps {
  label: string
  value: React.ReactNode
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='body1' fontWeight='bold'>
        {value ?? '-'}
      </Typography>
    </Box>
  </Grid>
)

interface ClientRegistrationProps {
  client: Partial<Client>
}

const ClientRegistration: React.FC<ClientRegistrationProps> = ({ client }) => {
  const { catalogs } = useCatalogs()

  const categoryName = catalogs?.client_categories.find(c => c.id === client.client_category_id)?.name || '-'
  const officeName = catalogs?.offices.find(o => o.id === client.office_id)?.name || '-'
  const agentName = catalogs?.agents.find(a => a.id === client.agent_id)?.name || '-'
  const executiveName = catalogs?.executives.find(e => e.id === client.executive_id)?.name || '-'
  const groupName = catalogs?.client_groups.find(g => g.id === client.client_group_id)?.name || '-'
  const branchName = catalogs?.client_branches.find(b => b.id === client.client_branch_id)?.name || '-'

  return (
    <Box>
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 4 }}>
        Información de Registro
      </Typography>
      <Grid container spacing={4}>
        <DetailItem label='Categoría de Cliente' value={categoryName} />
        <DetailItem label='Oficina' value={officeName} />
        <DetailItem label='Agente' value={agentName} />
        <DetailItem label='Ejecutivo' value={executiveName} />
        <DetailItem label='Grupo de Cliente' value={groupName} />
        <DetailItem label='Sucursal de Cliente' value={branchName} />
        <Grid item xs={12}>
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Notas
            </Typography>
            <Typography variant='body1' fontWeight='bold'>
              {client.notes || '-'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClientRegistration
