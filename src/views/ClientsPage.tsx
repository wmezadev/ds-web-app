'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material'
import Link from 'next/link'

import { SearchBar, DataTable } from '@/components/common'
import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES, API_ROUTES } from '@/constants/routes'
import { Client } from '@/types/client'
import { useApi } from '@/hooks/useApi'
import { useSession } from 'next-auth/react'

const formatFullName = (client: any) => {
  if (client.client_type === 'J') {
    return client.last_name || ''
  }
  return `${client.first_name || ''} ${client.last_name || ''}`.trim()
}

const formatPersonType = (client: any) => {
  return client.client_type === 'V' ? 'Natural' : 'Jurídico'
}

const formatStatus = (status: boolean) => {
  return status ? 'Activo' : 'Inactivo'
}

const columns = [
  {
    key: 'id' as const,
    label: 'ID',
    render: (value: number) => `#${value}`
  },
  {
    key: 'document_number' as const,
    label: 'Documento',
    render: (value: string, row: any) => (
      <Box>
        <div>{value}</div>
        {/* <div style={{ fontSize: '0.8em', color: '#666' }}>{row.phone || 'Sin teléfono'}</div> */}
      </Box>
    )
  },
  {
    key: 'client' as const,
    label: 'Cliente',
    render: (_: any, client: any) => (
      <Box>
        <div style={{ fontWeight: 500 }}>{formatFullName(client)}</div>
        <div style={{ fontSize: '0.8em', color: '#666' }}>{client.email_1 || 'Sin correo'}</div>
      </Box>
    )
  },
  {
    key: 'type' as const,
    label: 'Tipo',
    render: (_: any, client: any) => formatPersonType(client)
  },
  {
    key: 'birth_date' as const,
    label: 'Fecha Nac./Fund.',
    render: (date: string) => (date ? new Date(date).toLocaleDateString() : 'N/A')
  },
  {
    key: 'status' as const,
    label: 'Estado',
    render: (status: boolean) => (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: status ? 'success.light' : 'error.light',
          color: status ? 'success.contrastText' : 'error.contrastText',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}
      >
        {formatStatus(status)}
      </Box>
    )
  }
]

const ClientsPage = () => {
  const { data: session, status: sessionStatus } = useSession()
  const { fetchApi } = useApi()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Session status:', sessionStatus)
    console.log('Initial load:', initialLoad)
    console.log('Current clients:', clients.length)

    const loadClients = async () => {
      if (sessionStatus === 'loading') {
        console.log('Session is still loading, waiting...')
        return
      }

      if (sessionStatus === 'unauthenticated') {
        console.log('User is not authenticated')
        setError('Por favor inicie sesión para ver los clientes')
        setLoading(false)
        return
      }

      if (session && initialLoad) {
        try {
          console.log('Starting to load clients...')
          setLoading(true)
          setError(null)

          const response = await fetchApi(API_ROUTES.CLIENTS.LIST)
          console.log('API Response:', response)

          // Extraer el array de clientes de la respuesta
          const clientsData = Array.isArray(response?.clients) ? response.clients : []
          console.log('Extracted clients:', clientsData)

          setClients(clientsData)
          setFilteredClients(clientsData)
          setInitialLoad(false)
        } catch (err: any) {
          console.error('Error loading clients:', err)
          setError(err.message || 'Error al cargar los clientes')
          setClients([])
          setFilteredClients([])
        } finally {
          console.log('Finished loading attempt')
          setLoading(false)
        }
      }
    }

    loadClients()
  }, [sessionStatus, initialLoad, fetchApi, session])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    const lower = value.toLowerCase()
    setFilteredClients(
      clients.filter(client => Object.values(client).some(v => v?.toString().toLowerCase().includes(lower)))
    )
  }

  const handleClear = () => {
    setSearch('')
    setFilteredClients(clients)
  }

  if (loading)
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando clientes...</Typography>
      </Box>
    )
  if (error) return <Typography color='error'>{error}</Typography>

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {CLIENTS_PAGE.TITLE}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={CLIENTS_PAGE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={handleSearch}
          onClear={handleClear}
          extraActions={
            <Link href={ROUTES.CLIENTS.CREATE} passHref>
              <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                {CLIENTS_PAGE.CREATE_CLIENT}
              </Button>
            </Link>
          }
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={filteredClients} emptyMessage={CLIENTS_PAGE.NO_RESULTS} />
      </Box>
    </Box>
  )
}

export default ClientsPage
