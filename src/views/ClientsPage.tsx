'use client'

import React, { useCallback, useMemo, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Box, Typography, Button, Paper, CircularProgress, Tooltip } from '@mui/material'
import { useSession } from 'next-auth/react'

import { SearchBar, DataTable } from '@/components/common'
import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { useClients } from '@/hooks/useClients'
import { useClientSearch } from '@/hooks/useClientSearch'
import type { Client } from '@/types/client'

const formatFullName = (client: Client) =>
  client.client_type === 'J' ? client.last_name || '' : `${client.first_name || ''} ${client.last_name || ''}`.trim()

const formatPersonType = (client: Client) => (client.client_type === 'V' ? 'Natural' : 'Jurídico')

const formatSource = (source: string) => {
  if (source === 'cliente') return 'Cliente'
  
  if (source === 'prospecto') return 'Prospecto'

  return 'Cliente'
}

const ClientsPage = () => {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const apiEnabled = sessionStatus === 'authenticated'

  const [search, setSearch] = useState('')

  const { data: clientsPaginated, loading, error, page, perPage, totalPages, setPage } = useClients(10, apiEnabled)
  const { results: searchResults, loading: searchLoading, error: searchError } = useClientSearch(search, apiEnabled)

  const showingSearch = search.trim().length > 0
  const clientsToShow = showingSearch ? searchResults : clientsPaginated

  // Para búsqueda, paginación local
  const localTotalPages = showingSearch ? Math.max(1, Math.ceil(searchResults.length / perPage)) : totalPages || 1

  const columns = useMemo(
    () => [
      {
        key: 'id' as const,
        label: 'ID',
        render: (value: number) => `#${value}`
      },
      {
        key: 'document_number' as const,
        label: 'Documento',
        render: (value: string) => <Box>{value}</Box>
      },
      {
        key: 'client' as const,
        label: 'Cliente',
        render: (_: any, client: Client) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '250px',
              minWidth: '250px'
            }}
          >
            <Tooltip title={formatFullName(client)} placement='top-start' arrow>
              <Typography
                variant='body2'
                sx={{
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {formatFullName(client)}
              </Typography>
            </Tooltip>

            <Typography
              variant='caption'
              sx={{
                fontSize: '0.8em',
                color: '#666',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {client.email_1 || 'Sin correo'}
            </Typography>
          </Box>
        )
      },
      {
        key: 'type' as const,
        label: 'Tipo',
        render: (_: any, client: Client) => formatPersonType(client)
      },
      {
        key: 'birth_date' as const,
        label: 'Fecha Nac./Fund.',
        render: (date: string) => (date ? new Date(date).toLocaleDateString() : 'N/A')
      },
      {
        key: 'source' as const,
        label: 'Tipo',
        render: (source: string) => {
          // Handle API format (C/P) and form format (cliente/prospecto)
          // Default to 'cliente' for null/undefined/empty values
          let normalizedSource = 'cliente'
          
          if (source === 'P' || source === 'prospecto') {
            normalizedSource = 'prospecto'
          } else if (source === 'C' || source === 'cliente') {
            normalizedSource = 'cliente'
          }
          // For null/undefined/empty or any other value, keep default 'cliente'
          
          return (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                backgroundColor: normalizedSource === 'cliente' ? 'primary.light' : 'warning.light',
                color: normalizedSource === 'cliente' ? 'primary.contrastText' : 'warning.contrastText',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              {formatSource(normalizedSource)}
            </Box>
          )
        }
      },
      {
        key: 'actions' as const,
        label: 'Acciones',
        render: (_: any, client: Client) => (
          <Button
            variant='outlined'
            color='primary'
            size='small'
            onClick={() => router.push(ROUTES.CLIENTS.DETAIL(client.id))}
          >
            Ver Detalles
          </Button>
        )
      }
    ],
    [router]
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query)
      setPage(1)
    },
    [setPage]
  )

  if (sessionStatus === 'loading') {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando sesión...</Typography>
      </Box>
    )
  }

  if (loading || searchLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{showingSearch ? 'Buscando clientes...' : 'Cargando clientes...'}</Typography>
      </Box>
    )
  }

  if (error || searchError) {
    return <Typography color='error'>{error || searchError}</Typography>
  }

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
          onClear={() => {
            setSearch('')
            setPage(1)
          }}
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

      <Box sx={{ mt: 2 }}>
        <DataTable
          columns={columns}
          rows={clientsToShow}
          emptyMessage={CLIENTS_PAGE.NO_RESULTS}
          page={page}
          onPageChange={setPage}
          itemsPerPage={perPage}
          totalPages={localTotalPages}
          paginateLocally={showingSearch}
        />
      </Box>
    </Box>
  )
}

export default ClientsPage
