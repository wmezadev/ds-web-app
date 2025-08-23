'use client'

import { Typography, Grid, Box, Stack, Divider } from '@mui/material'

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

interface ClientBankAccountsProps {
  client: Partial<Client>
}

const ClientBankAccounts: React.FC<ClientBankAccountsProps> = ({ client }) => {
  const bankAccounts = client.bank_accounts || []

  return (
    <Box>
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 4 }}>
        Información Bancaria
      </Typography>
      
      {bankAccounts.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay cuentas bancarias registradas.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {bankAccounts.map((account, index) => (
            <Box key={index} p={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
              <Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
                Cuenta Bancaria #{index + 1}
              </Typography>
              <Grid container spacing={3}>
                <DetailItem 
                  label='Banco' 
                  value={account.bank_name} 
                />
                <DetailItem 
                  label='Número de Cuenta' 
                  value={account.account_number} 
                />
                <DetailItem 
                  label='Moneda' 
                  value={account.currency} 
                />
                <DetailItem 
                  label='Tipo de Cuenta' 
                  value={account.account_type} 
                />
                {account.notes && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Observaciones
                      </Typography>
                      <Typography variant='body1' sx={{ mt: 0.5 }}>
                        {account.notes}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
              {index < bankAccounts.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ClientBankAccounts
