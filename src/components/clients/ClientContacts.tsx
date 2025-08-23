'use client'

import { useState } from 'react'

import { Box, Grid, Stack, Typography, Button } from '@mui/material'
import { Add } from '@mui/icons-material'
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
      <Typography variant='body1' fontWeight='medium'>
        {value || '-'}
      </Typography>
    </Box>
  </Grid>
)

interface ClientContactsProps {
  client: Partial<Client>
}

const ClientContacts: React.FC<ClientContactsProps> = ({ client }) => {
  const [contacts, setContacts] = useState(client.contacts || [])

  const handleAddContact = () => {
    setContacts(prev => [
      ...prev,
      { full_name: '', position: '', phone: '', email: '', notes: '' }
    ])
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Contactos
        </Typography>
        <Button variant='outlined' startIcon={<Add />} onClick={handleAddContact}>
          Nuevo Contacto
        </Button>
      </Stack>

      {contacts.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay contactos registrados.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {contacts.map((contact, index) => (
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Grid container spacing={3}>
                <DetailItem label='Nombre Completo' value={contact.full_name} />
                <DetailItem label='Posición/Cargo' value={contact.position} />
                <DetailItem label='Teléfono' value={contact.phone} />
                <DetailItem label='Email' value={contact.email} />
                {contact.notes && <DetailItem label='Notas' value={contact.notes} />}
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ClientContacts
