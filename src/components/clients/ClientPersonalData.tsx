'use client'

import { Typography, Grid, Box } from '@mui/material'

import type { Client } from '@/types/client'

const getCivilStatusDisplay = (status: string | null): string => {
  if (!status) return '-'
  
  // Map known values to Spanish display text
  const statusMap: Record<string, string> = {
    'single': 'Soltero',
    'married': 'Casado', 
    'divorced': 'Divorciado',
    'widowed': 'Viudo'
  }
  
  return statusMap[status] || status
}

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

interface ClientPersonalDataProps {
  client: Partial<Client>
  professionName?: string
  occupationName?: string
}

const ClientPersonalData: React.FC<ClientPersonalDataProps> = ({ client, professionName, occupationName }) => {
  const { personal_data } = client

  if (!personal_data) {
    return <Typography>No hay datos personales disponibles.</Typography>
  }

  return (
    <Box>
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 4 }}>
        Datos Personales
      </Typography>
      <Grid container spacing={4}>
        <DetailItem label='Género' value={personal_data.gender} />
        <DetailItem label='Estado Civil' value={getCivilStatusDisplay(personal_data.civil_status)} />
        <DetailItem label='Altura (cm)' value={personal_data.height} />
        <DetailItem label='Peso (kg)' value={personal_data.weight} />
        <DetailItem label='Fumador' value={personal_data.smoker ? 'Sí' : 'No'} />
        <DetailItem label='Deportes' value={personal_data.sports} />
        <DetailItem label='Patología' value={personal_data.pathology} />
        <DetailItem label='Profesión' value={professionName} />
        <DetailItem label='Ocupación' value={occupationName} />
        <DetailItem label='Ingreso Mensual' value={personal_data.monthly_income} />
        <DetailItem label='RIF' value={personal_data.rif} />
      </Grid>
    </Box>
  )
}

export default ClientPersonalData
