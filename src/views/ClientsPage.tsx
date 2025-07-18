'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import Link from 'next/link'

import { SearchBar, DataTable } from '@/components/common'
import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'
import { Client } from '@/types/client'

const mockClients: Client[] = [
  {
    codigo: 'C001',
    cedula: '10784524',
    cliente: 'Acme Corporation',
    persona: 'N',
    fechaNacimiento: '1990-05-12',
    estado: 'Activo'
  },
  {
    codigo: 'C002',
    cedula: '001180343',
    cliente: 'Globex Inc',
    persona: 'J',
    fechaNacimiento: '1985-09-20',
    estado: 'Inactivo'
  },
  {
    codigo: 'C003',
    cedula: '8745551',
    cliente: 'Soylent Co',
    persona: 'N',
    fechaNacimiento: '1978-11-03',
    estado: 'Activo'
  },
  {
    codigo: 'C001',
    cedula: '10784524',
    cliente: 'Acme Corporation',
    persona: 'N',
    fechaNacimiento: '1990-05-12',
    estado: 'Activo'
  },
  {
    codigo: 'C002',
    cedula: '001180343',
    cliente: 'Globex Inc',
    persona: 'J',
    fechaNacimiento: '1985-09-20',
    estado: 'Inactivo'
  },
  {
    codigo: 'C003',
    cedula: '8745551',
    cliente: 'Soylent Co',
    persona: 'N',
    fechaNacimiento: '1978-11-03',
    estado: 'Activo'
  },
  {
    codigo: 'C001',
    cedula: '10784524',
    cliente: 'Acme Corporation',
    persona: 'N',
    fechaNacimiento: '1990-05-12',
    estado: 'Activo'
  },
  {
    codigo: 'C002',
    cedula: '001180343',
    cliente: 'Globex Inc',
    persona: 'J',
    fechaNacimiento: '1985-09-20',
    estado: 'Inactivo'
  },
  {
    codigo: 'C003',
    cedula: '8745551',
    cliente: 'Soylent Co',
    persona: 'N',
    fechaNacimiento: '1978-11-03',
    estado: 'Activo'
  },
  {
    codigo: 'C001',
    cedula: '10784524',
    cliente: 'Acme Corporation',
    persona: 'N',
    fechaNacimiento: '1990-05-12',
    estado: 'Activo'
  },
  {
    codigo: 'C002',
    cedula: '001180343',
    cliente: 'Globex Inc',
    persona: 'J',
    fechaNacimiento: '1985-09-20',
    estado: 'Inactivo'
  },
  {
    codigo: 'C003',
    cedula: '8745551',
    cliente: 'Soylent Co',
    persona: 'N',
    fechaNacimiento: '1978-11-03',
    estado: 'Activo'
  }
]

const columns = [
  { key: 'codigo' as const, label: 'Código' },
  { key: 'cedula' as const, label: 'Cédula' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'persona' as const, label: 'Persona' },
  { key: 'fechaNacimiento' as const, label: 'Fecha de Nac./Fund.' },
  {
    key: 'estado' as const,
    label: 'Estado',
    render: (value: string) => <span style={{ color: value === 'Activo' ? 'green' : 'red' }}>{value}</span>
  }
]

const ClientsPage = () => {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<Client[]>(mockClients)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    const lower = value.toLowerCase()
    setClients(
      mockClients.filter(client => Object.values(client).some(v => v?.toString().toLowerCase().includes(lower)))
    )
  }

  const handleClear = () => {
    setSearch('')
    setClients(mockClients)
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

      {/* Espaciado con Box en lugar de pasar sx directo al DataTable */}
      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={clients} emptyMessage={CLIENTS_PAGE.NO_RESULTS} />
      </Box>
    </Box>
  )
}

export default ClientsPage
