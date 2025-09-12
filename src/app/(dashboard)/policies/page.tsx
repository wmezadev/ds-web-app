'use client'

import React from 'react'

import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'

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

  const hasResults = filtered.length > 0

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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{POLICIES_PAGE.tableHeaders.nroPoliza}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.cliente}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.ramo}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.aseguradora}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.fechaEmision}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.estado}</TableCell>
              <TableCell>{POLICIES_PAGE.tableHeaders.estadoGestion}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {hasResults ? (
              filtered.map(row => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.nroPoliza}</TableCell>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell>{row.ramo}</TableCell>
                  <TableCell>{row.aseguradora}</TableCell>
                  <TableCell>{row.fechaEmision}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                  <TableCell>{row.estadoGestion}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant='body2' color='text.secondary' textAlign='center' py={6}>
                    {POLICIES_PAGE.noResults}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
