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
  {
    codigo: 'C001',
    cedula: '10784524',
    cliente: 'Acme Corp',
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

const ClientsPage = () => {
  const theme = useTheme()
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState(mockClients)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setClients(
      mockClients.filter(
        client =>
          client.codigo.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.cedula.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.cliente.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.persona.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.fechaNacimiento.toLowerCase().includes(e.target.value.toLowerCase()) ||
          client.estado.toLowerCase().includes(e.target.value.toLowerCase())
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
              <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cédula</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Persona</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha de Nac./Fund.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
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
                <TableRow key={client.codigo} hover>
                  <TableCell>{client.codigo}</TableCell>
                  <TableCell>{client.cedula}</TableCell>
                  <TableCell>{client.cliente}</TableCell>
                  <TableCell>{client.persona}</TableCell>
                  <TableCell>{client.fechaNacimiento}</TableCell>
                  <TableCell>
                    <span style={{ color: client.estado === 'Activo' ? 'green' : 'red' }}>{client.estado}</span>
                  </TableCell>
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
