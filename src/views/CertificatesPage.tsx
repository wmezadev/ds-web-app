'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import Link from 'next/link'

import { SearchBar, DataTable } from '@/components/common'
import { CERTIFICATES_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { Certificate } from '@/types/certificate'

const mockCertificates: Certificate[] = [
  {
    nroPoliza: '4602060000152',
    certificado: '16230883',
    aseguradora: 'Mapfre',
    ramo: 'Salud individual',
    asegurado: 'Jorge Rojas',
    fechaIngreso: '17-07-2025',
    estadoGestion: 'Vigente'
  }
]

const columns = [
  { key: 'nroPoliza' as const, label: 'Poliza' },
  { key: 'certificado' as const, label: 'Certificado' },
  { key: 'aseguradora' as const, label: 'Aseguradora' },
  { key: 'ramo' as const, label: 'Ramo' },
  { key: 'asegurado' as const, label: 'Asegurado' },
  { key: 'fechaIngreso' as const, label: 'Fecha Ingreso' },
  {
    key: 'estadoGestion' as const,
    label: 'Estado Gestión',
    render: (value: string) => (
      <span style={{ color: value === 'Vigente' ? 'green' : value === 'Vencida' ? 'red' : 'black' }}>{value}</span>
    )
  }
]

const CertificatesPage = () => {
  const [search, setSearch] = useState('')
  const [policies, setPolicies] = useState<Certificate[]>(mockCertificates)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    const lower = value.toLowerCase()
    setPolicies(
      mockCertificates.filter(certificate =>
        Object.values(certificate).some(v => v?.toString().toLowerCase().includes(lower))
      )
    )
  }

  const handleClear = () => {
    setSearch('')
    setPolicies(mockCertificates)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {CERTIFICATES_PAGE.TITLE}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={CERTIFICATES_PAGE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={handleSearch}
          onClear={handleClear}
          extraActions={
            <Link href={ROUTES.CERTIFICATES.CREATE} passHref>
              <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                {CERTIFICATES_PAGE.CREATE_CERTIFICATE}
              </Button>
            </Link>
          }
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={policies} emptyMessage={CERTIFICATES_PAGE.noResults} />
      </Box>
    </Box>
  )
}

export default CertificatesPage
