'use client'

import React, { useCallback, useState, useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material'
import { useSession } from 'next-auth/react'

import { SearchBar, DataTable } from '@/components/common'
import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { useClients } from '@/hooks/useClients'
import type { Client } from '@/types/client'

// --- helpers de formato ---
const formatFullName = (client: Client) =>
  client.client_type === 'J' ? client.last_name || '' : `${client.first_name || ''} ${client.last_name || ''}`.trim()

const formatPersonType = (client: Client) => (client.client_type === 'V' ? 'Natural' : 'Jurídico')
const formatStatus = (status: boolean) => (status ? 'Activo' : 'Inactivo')

const ClientsPage = () => {
  const { status: sessionStatus } = useSession()
  const router = useRouter()

  // habilitar fetch cuando hay sesión
  const apiEnabled = sessionStatus === 'authenticated'

  // Traemos datos (aunque la API no pagine bien, los usamos como fuente)
  const { data: clients, loading, error, setParams } = useClients(2, apiEnabled)

  // Estado local de UI
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1) // paginación en memoria

  // Columnas (memo para evitar recrearlas en cada render)
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
          <Box>
            <div style={{ fontWeight: 500 }}>{formatFullName(client)}</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>{client.email_1 || 'Sin correo'}</div>
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
        key: 'status' as const,
        label: 'Estado',
        render: (status: boolean) => (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
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

  // Handler de búsqueda
  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query)
      setParams({ query })
      setPage(1) // reset vista local
    },
    [setParams]
  )

  // Carga sesión
  if (sessionStatus === 'loading') {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando sesión...</Typography>
      </Box>
    )
  }

  // Carga datos
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando clientes...</Typography>
      </Box>
    )
  }

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
          onClear={() => {
            setSearch('')
            setParams({ query: '' })
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
          rows={clients}
          emptyMessage={CLIENTS_PAGE.NO_RESULTS}
          page={page}
          onPageChange={setPage}
          itemsPerPage={2} // paginación en memoria (prueba)
        />
      </Box>
    </Box>
  )
}

export default ClientsPage
