import React, { useState } from 'react'

import { Box, Button, Grid, Stack, Typography } from '@mui/material'
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

interface ClientBankAccountsProps {
  client: Partial<Client>
}

const ClientBankAccounts: React.FC<ClientBankAccountsProps> = ({ client }) => {
  const [bankAccounts, setBankAccounts] = useState(client.bank_accounts || [])

  const handleAddAccount = () => {
    setBankAccounts(prev => [...prev, { bank_name: '', account_number: '', currency: '', account_type: '', notes: '' }])
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Información Bancaria
        </Typography>
        <Button variant='outlined' startIcon={<Add />} onClick={handleAddAccount}>
          Nueva Cuenta
        </Button>
      </Stack>

      {bankAccounts.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay cuentas bancarias registradas.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {bankAccounts.map((account, index) => (
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Grid container spacing={3}>
                <DetailItem label='Banco' value={account.bank_name} />
                <DetailItem label='Número de Cuenta' value={account.account_number} />
                <DetailItem label='Moneda' value={account.currency} />
                <DetailItem label='Tipo de Cuenta' value={account.account_type} />
                {account.notes && <DetailItem label='Notas' value={account.notes} />}
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ClientBankAccounts
