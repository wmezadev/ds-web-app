'use client'

import React, { useMemo } from 'react'

import { Box, Button, Typography, Paper } from '@mui/material'

import { DataTable } from '@/components/common'
import SearchBar from '@/components/common/SearchBar'

import { POLICIES_PAGE } from '@/constants/texts'

type PolicyUI = {
  id: string
  nroPoliza: string
  cliente: string
  ramo: string
  aseguradora: string
  fechaEmision: string
  estado: string
  estadoGestion: string
}

const mockData: PolicyUI[] = []

export default function PoliciesPage() {
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    if (!query.trim()) return mockData
    const q = query.toLowerCase()

    return mockData.filter(
      p =>
        p.nroPoliza.toLowerCase().includes(q) ||
        p.cliente.toLowerCase().includes(q) ||
        p.aseguradora.toLowerCase().includes(q) ||
        p.ramo.toLowerCase().includes(q)
    )
  }, [query])

  const columns = useMemo(
    () => [
      { key: 'nroPoliza' as const, label: POLICIES_PAGE.tableHeaders.nroPoliza },
      { key: 'cliente' as const, label: POLICIES_PAGE.tableHeaders.cliente },
      { key: 'ramo' as const, label: POLICIES_PAGE.tableHeaders.ramo },
      { key: 'aseguradora' as const, label: POLICIES_PAGE.tableHeaders.aseguradora },
      { key: 'fechaEmision' as const, label: POLICIES_PAGE.tableHeaders.fechaEmision },
      { key: 'estado' as const, label: POLICIES_PAGE.tableHeaders.estado },
      { key: 'estadoGestion' as const, label: POLICIES_PAGE.tableHeaders.estadoGestion }
    ],
    []
  )

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
          onChange={setQuery}
          onClear={() => setQuery('')}
          delay={400}
        />
      </Paper>

      <Box>
        <DataTable
          columns={columns}
          rows={filtered}
          emptyMessage={POLICIES_PAGE.noResults}
          page={1}
          onPageChange={() => {}}
          itemsPerPage={10}
          totalPages={1}
          paginateLocally={true}
        />
      </Box>
    </Box>
  )
}
