'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import Link from 'next/link'

import { SearchBar, DataTable } from '@/components/common'
import { QUOTATIONS_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { Quotation } from '@/types/quotation'

const mockQuotations: Quotation[] = [
  {
    nroCotizacion: 'Q001',
    fecha: '2025-07-17',
    cliente: 'Acme Corporation',
    ramo: 'Riesgos',
    aseguradora: 'Mapfre',
    estado: 'Pendiente',
    asignadoA: 'Juan Pérez',
    estadoGestion: 'En proceso'
  },
  {
    nroCotizacion: 'Q002',
    fecha: '2025-07-16',
    cliente: 'Globex Inc',
    ramo: 'Vida',
    aseguradora: 'La Positiva',
    estado: 'Aprobada',
    asignadoA: 'María López',
    estadoGestion: 'Completada'
  },
  {
    nroCotizacion: 'Q003',
    fecha: '2025-07-15',
    cliente: 'Soylent Co',
    ramo: 'Automóvil',
    aseguradora: 'Pacifico',
    estado: 'Rechazada',
    asignadoA: 'Carlos Gómez',
    estadoGestion: 'Pendiente'
  }
]

const columns = [
  { key: 'nroCotizacion' as const, label: 'Nro Cotización' },
  { key: 'fecha' as const, label: 'Fecha' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'ramo' as const, label: 'Ramo' },
  { key: 'aseguradora' as const, label: 'Aseguradora' },
  { key: 'estado' as const, label: 'Estado' },
  { key: 'asignadoA' as const, label: 'Asignado a' },
  {
    key: 'estadoGestion' as const,
    label: 'Estado Gestión',
    render: (value: string) => <span style={{ color: value === 'Completada' ? 'green' : value === 'Pendiente' ? 'orange' : 'black' }}>{value}</span>
  }
]

const QuotationsPage = () => {
  const [search, setSearch] = useState('')
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    const lower = value.toLowerCase()
    setQuotations(
      mockQuotations.filter(quotation => Object.values(quotation).some(v => v?.toString().toLowerCase().includes(lower)))
    )
  }

  const handleClear = () => {
    setSearch('')
    setQuotations(mockQuotations)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {QUOTATIONS_PAGE.TITLE}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          placeholder={QUOTATIONS_PAGE.SEARCH_PLACEHOLDER}
          value={search}
          onChange={handleSearch}
          onClear={handleClear}
          extraActions={
            <Link href={ROUTES.QUOTATIONS.CREATE} passHref>
              <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
                {QUOTATIONS_PAGE.CREATE_QUOTATION}
              </Button>
            </Link>
          }
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={quotations} emptyMessage={QUOTATIONS_PAGE.NO_RESULTS} />
      </Box>
    </Box>
  )
}

export default QuotationsPage
