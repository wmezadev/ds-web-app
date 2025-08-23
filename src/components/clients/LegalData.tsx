'use client'

import { Typography, Grid, Box } from '@mui/material'

import type { Client } from '@/types/client'

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
      <Typography variant='body1' sx={{ mt: 0.5 }}>
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

interface Props {
  client: Partial<Client>
}

const LegalData: React.FC<Props> = ({ client }) => {
  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Información Legal
      </Typography>
      <Grid container spacing={3}>
        <DetailItem 
          label='Representante Legal' 
          value={client.legal_data?.legal_representative} 
        />
        <DetailItem 
          label='Actividad Económica' 
          value={client.legal_data?.economic_activity_id} 
        />
      </Grid>
    </Box>
  )
}

export default LegalData
