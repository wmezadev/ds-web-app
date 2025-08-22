'use client'

import React from 'react'
import { Typography, Grid, Box } from '@mui/material'
import { Client } from '@/types/client'

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
}

const ClientPersonalData: React.FC<ClientPersonalDataProps> = ({ client }) => {
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
        <DetailItem label='Estado Civil' value={personal_data.civil_status} />
        <DetailItem label='Altura (cm)' value={personal_data.height} />
        <DetailItem label='Peso (kg)' value={personal_data.weight} />
        <DetailItem label='Fumador' value={personal_data.smoker ? 'Sí' : 'No'} />
        <DetailItem label='Deportes' value={personal_data.sports} />
        <DetailItem label='Patología' value={personal_data.pathology} />
        <DetailItem label='Profesión' value={personal_data.profession_id} />
        <DetailItem label='Ocupación' value={personal_data.occupation_id} />
        <DetailItem label='Ingreso Mensual' value={personal_data.monthly_income} />
        <DetailItem label='RIF' value={personal_data.rif} />
      </Grid>
    </Box>
  )
}

export default ClientPersonalData
