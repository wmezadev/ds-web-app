'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material/styles'

import { CLIENTS_PAGE } from '@/constants/texts'
import { ROUTES } from '@/constants/routes'

// Example data (replace with real data/fetch logic)
const mockClients = [
  { id: 1, name: 'Acme Corp', email: 'info@acme.com', phone: '555-1234' },
  { id: 2, name: 'Globex Inc', email: 'contact@globex.com', phone: '555-5678' },
  { id: 3, name: 'Soylent Co', email: 'hello@soylent.com', phone: '555-8765' }
]

const ClientsPage = () => {
  const theme = useTheme()
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState(mockClients)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setClients(
      mockClients.filter(
        client =>
          client.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.phone.includes(e.target.value)
      )
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        {CLIENTS_PAGE.TITLE}
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder={CLIENTS_PAGE.SEARCH_PLACEHOLDER}
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon color='action' />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => {
                      setSearch('')
                      setClients(mockClients)
                    }}
                  >
                    <SearchIcon color='primary' />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Link href={ROUTES.CLIENTS.CREATE} passHref>
            <Button variant='contained' color='primary' sx={{ whiteSpace: 'nowrap', minWidth: 140 }}>
              {CLIENTS_PAGE.CREATE_CLIENT}
            </Button>
          </Link>
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: theme.palette.background.default }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  {CLIENTS_PAGE.NO_RESULTS}
                </TableCell>
              </TableRow>
            ) : (
              clients.map(client => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ClientsPage
