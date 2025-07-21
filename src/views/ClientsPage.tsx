'use client'

import React, { useEffect, useState, useCallback } from 'react'

import Link from 'next/link'

import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material'

import { useSession } from 'next-auth/react'

import { SearchBar, DataTable } from '@/components/common'
import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES, API_ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'
import { useApi } from '@/hooks/useApi'

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

const DEFAULT_LIMIT = 50

const ClientsPage = () => {
  const { data: session, status: sessionStatus } = useSession()
  const { fetchApi } = useApi()

  // datos base cargados al inicio (para reset al limpiar search)
  const [clients, setClients] = useState<Client[]>([])

  // datos visibles (búsqueda o lista completa)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // loading específico de búsqueda remota
  const [searchLoading, setSearchLoading] = useState(false)

  // ---- CARGA INICIAL ----
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
        setInitialLoad(false) // evita loops

        return
      }

      if (session && initialLoad) {
        try {
          console.log('Starting to load clients...')
          setLoading(true)
          setError(null)

          const response = await fetchApi(API_ROUTES.CLIENTS.LIST)

          console.log('API Response:', response)

          // Ajusta según formato real de respuesta
          const clientsData = Array.isArray(response?.clients) ? response.clients : []

          console.log('Extracted clients:', clientsData)

          setClients(clientsData)
          setFilteredClients(clientsData)
        } catch (err: any) {
          console.error('Error loading clients:', err)
          setError(err.message || 'Error al cargar los clientes')
          setClients([])
          setFilteredClients([])
        } finally {
          console.log('Finished loading attempt')
          setLoading(false)
          setInitialLoad(false)
        }
      }
    }

    loadClients()
  }, [sessionStatus, initialLoad, fetchApi, session, clients.length])

  // ---- BÚSQUEDA REMOTA ----
  const handleSearch = useCallback(
    async (query: string) => {
      // El SearchBar ya nos entrega query debounced
      setSearch(query)

      // si está vacío → restaurar lista inicial sin llamar search
      if (!query.trim()) {
        setFilteredClients(clients)

        return
      }

      setSearchLoading(true)

      try {
        const params = new URLSearchParams({
          query,
          skip: '0',
          limit: String(DEFAULT_LIMIT)
        })

        const response = await fetchApi(`${API_ROUTES.CLIENTS.SEARCH}?${params.toString()}`)

        // Ajusta al formato real de la respuesta
        const results = Array.isArray(response?.clients) ? response.clients : []

        setFilteredClients(results)
      } catch (err) {
        console.error('Client search failed:', err)
        setFilteredClients([])
      } finally {
        setSearchLoading(false)
      }
    },
    [clients, fetchApi]
  )

  // ---- CLEAR ----
  const handleClear = () => {
    setSearch('')
    setFilteredClients(clients)
  }

  // ---- LOADING / ERROR ----
  if (loading)
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando clientes...</Typography>
      </Box>
    )

  if (error) return <Typography color='error'>{error}</Typography>

  // ---- RENDER ----
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {CLIENTS_PAGE.TITLE}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={CLIENTS_PAGE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={handleSearch} // <- ahora recibe string (debounced)
          onClear={handleClear}
          extraActions={
            <Link href={ROUTES.CLIENTS.CREATE} passHref>
              <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                {CLIENTS_PAGE.CREATE_CLIENT}
              </Button>
            </Link>
          }
          delay={400}
        />
      </Paper>

      {searchLoading && (
        <Typography sx={{ mb: 1, fontSize: '0.85rem', color: 'text.secondary' }}>Buscando “{search}”...</Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={filteredClients} emptyMessage={CLIENTS_PAGE.NO_RESULTS} />
      </Box>
    </Box>
  )
}

export default ClientsPage
