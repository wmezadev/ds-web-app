'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import Link from 'next/link'

import { SearchBar, DataTable } from '@/components/common'
import { POLICIES_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { Policy } from '@/types/policy'

const mockPolicies: Policy[] = [
  {
    nroPoliza: '4602060000152',
    aseguradora: 'Mapfre',
    ramo: 'Salud individual',
    cliente: 'Acme Corporation',
    vigencia: '17-07-2025 al 17-07-2026',
    estadoGestion: 'Vigente'
  },
  {
    nroPoliza: '02B3416971',
    aseguradora: 'ASSISTO',
    ramo: 'Responsabilidad civil',
    cliente: 'José Rodríguez',
    vigencia: '17-05-2025 al 17-07-2026',
    estadoGestion: 'Vigente'
  },
  {
    nroPoliza: '02B3416971',
    aseguradora: 'ASSISTO',
    ramo: 'Responsabilidad civil',
    cliente: 'Ramón Hernández A.',
    vigencia: '17-05-2024 al 17-06-2025',
    estadoGestion: 'Vencida'
  }
]

const columns = [
  { key: 'nroPoliza' as const, label: 'Poliza' },
  { key: 'aseguradora' as const, label: 'Aseguradora' },
  { key: 'ramo' as const, label: 'Ramo' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'vigencia' as const, label: 'Vigencia' },
  {
    key: 'estadoGestion' as const,
    label: 'Estado Gestión',
    render: (value: string) => (
      <span style={{ color: value === 'Vigente' ? 'green' : value === 'Vencida' ? 'red' : 'black' }}>{value}</span>
    )
  }
]

const PoliciesPage = () => {
  const [search, setSearch] = useState('')
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    const lower = value.toLowerCase()
    setPolicies(
      mockPolicies.filter(policy => Object.values(policy).some(v => v?.toString().toLowerCase().includes(lower)))
    )
  }

  const handleClear = () => {
    setSearch('')
    setPolicies(mockPolicies)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {POLICIES_PAGE.title}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={POLICIES_PAGE.searchPlaceholder}
          value={search}
          onChange={handleSearch}
          onClear={handleClear}
          extraActions={
            <Link href={ROUTES.POLICIES.CREATE} passHref>
              <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                {POLICIES_PAGE.createPolicy}
              </Button>
            </Link>
          }
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={policies} emptyMessage={POLICIES_PAGE.noResults} />
      </Box>
    </Box>
  )
}

export default PoliciesPage
