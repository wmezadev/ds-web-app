'use client'

import React, { useMemo } from 'react'

import { useSession } from 'next-auth/react'

import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'

import { DataTable } from '@/components/common'
import SearchBar from '@/components/common/SearchBar'

import { POLICIES_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import type { Policy } from '@/types/policy'
import { usePolicies } from '@/hooks/usePolicies'

export default function PoliciesPage() {
  const { status: sessionStatus } = useSession()
  const apiEnabled = sessionStatus === 'authenticated'

  const [query, setQuery] = React.useState('')

  const {
    data: policies,
    loading,
    error,
    page,
    perPage,
    totalPages,
    setPage,
    setParams
  } = usePolicies({
    initialPerPage: 10,
    dataKey: 'policies',
    enabled: apiEnabled
  })

  const handleSearch = (query: string) => {
    setQuery(query)
    setPage(1)
    setParams({ search_param: query })
  }

  const columns = useMemo(
    () => [
      {
        key: 'nroPoliza' as const,
        label: POLICIES_PAGE.tableHeaders.nroPoliza,
        render: (_: any, row: Policy) => row.policy_number
      },
      {
        key: 'aseguradora' as const,
        label: POLICIES_PAGE.tableHeaders.aseguradora,
        render: (_: any, row: Policy) => row.insurance_company?.name || '-'
      },
      {
        key: 'ramo' as const,
        label: POLICIES_PAGE.tableHeaders.ramo,
        render: (_: any, row: Policy) => row.line?.name || '-'
      },
      {
        key: 'cliente' as const,
        label: POLICIES_PAGE.tableHeaders.cliente,
        render: (_: any, row: Policy) => {
          if (!row.insured) return '-'

          return row.insured.client_type === 'J'
            ? row.insured.last_name
            : `${row.insured.first_name} ${row.insured.last_name}`.trim()
        }
      },
      {
        key: 'vigencia' as const,
        label: 'Vigencia',
        render: (_: any, row: Policy) => {
          const start = row.effective_date ? new Date(row.effective_date) : null
          const end = row.expiration_date ? new Date(row.expiration_date) : null

          if (!start && !end) return '-'

          const formatDate = (d: Date) =>
            `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

          return `${start ? formatDate(start) : '-'} al ${end ? formatDate(end) : '-'}`
        }
      },
      {
        key: 'actions' as const,
        label: 'Acciones',
        render: (_: any, row: any) => (
          <Button variant='outlined' color='primary' size='small' href={ROUTES.POLICIES.DETAIL(row.id)}>
            Ver Detalles
          </Button>
        )
      }
    ],
    []
  )

  if (sessionStatus === 'loading') {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando sesión...</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando pólizas...</Typography>
      </Box>
    )
  }

  if (error) {
    return <Typography color='error'>{String(error)}</Typography>
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
          {POLICIES_PAGE.title}
        </Typography>
        <div>
          <Button variant='contained' color='primary' onClick={() => {}}>
            {POLICIES_PAGE.createPolicy}
          </Button>
        </div>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={POLICIES_PAGE.searchPlaceholder}
          value={query}
          onChange={handleSearch}
          onClear={() => handleSearch('')}
          delay={400}
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <DataTable
          columns={columns}
          rows={policies || []}
          emptyMessage={POLICIES_PAGE.noResults}
          page={page}
          onPageChange={setPage}
          itemsPerPage={perPage}
          totalPages={totalPages}
          paginateLocally={false}
        />
      </Box>
    </Box>
  )
}
