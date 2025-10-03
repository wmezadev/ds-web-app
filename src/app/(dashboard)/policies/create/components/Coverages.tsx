'use client'

import React, { useState, useEffect } from 'react'

import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  TextField,
  InputAdornment
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import { useInsuranceCoverages } from '../hooks/useInsuranceCoverages'
import type { Coverage } from '@/types/coverage'
import type { PolicyCoverage } from '@/types/policy'

interface CoveragesProps {
  insuranceLineId: number | null
  selectedCoverages?: PolicyCoverage[]
  onSelectionChange?: (coverages: PolicyCoverage[]) => void
}

export default function Coverages({ insuranceLineId, selectedCoverages = [], onSelectionChange }: CoveragesProps) {
  const { coverages, loading, error } = useInsuranceCoverages({
    insuranceLineId,
    enabled: !!insuranceLineId
  })

  const [selected, setSelected] = useState<PolicyCoverage[]>(selectedCoverages)

  useEffect(() => {
    setSelected(selectedCoverages)
  }, [selectedCoverages])

  useEffect(() => {
    if (insuranceLineId) {
      setSelected([])
      onSelectionChange?.([])
    }
  }, [insuranceLineId])

  const handleToggle = (coverageId: number) => {
    const existingIndex = selected.findIndex(c => c.coverage_id === coverageId)

    let newSelected: PolicyCoverage[]
    if (existingIndex >= 0) {
      // Remove coverage
      newSelected = selected.filter(c => c.coverage_id !== coverageId)
    } else {
      // Add coverage with default values
      newSelected = [...selected, { coverage_id: coverageId, status: true, sum_insured: '0.00' }]
    }

    setSelected(newSelected)
    onSelectionChange?.(newSelected)
  }

  const handleSumInsuredChange = (coverageId: number, value: string) => {
    const newSelected = selected.map(c => (c.coverage_id === coverageId ? { ...c, sum_insured: value } : c))
    setSelected(newSelected)
    onSelectionChange?.(newSelected)
  }

  if (!insuranceLineId) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Coberturas Disponibles
        </Typography>
        <Alert severity='info'>Selecciona un ramo de seguro para ver las coberturas disponibles</Alert>
      </Paper>
    )
  }

  if (loading) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Coberturas Disponibles
        </Typography>
        <Box display='flex' justifyContent='center' alignItems='center' py={4}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Coberturas Disponibles
        </Typography>
        <Alert severity='error'>{error}</Alert>
      </Paper>
    )
  }

  if (coverages.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Coberturas Disponibles
        </Typography>
        <Alert severity='warning'>No hay coberturas disponibles para este ramo de seguro</Alert>
      </Paper>
    )
  }

  const isSelected = (coverageId: number) => selected.some(c => c.coverage_id === coverageId)
  const getSelectedCoverage = (coverageId: number) => selected.find(c => c.coverage_id === coverageId)

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Coberturas Disponibles</Typography>
        <Box display='flex' gap={1}>
          {selected.length > 0 && (
            <Chip
              label={`${selected.length} seleccionada${selected.length !== 1 ? 's' : ''}`}
              color='success'
              size='small'
            />
          )}
          <Chip
            label={`${coverages.length} disponible${coverages.length !== 1 ? 's' : ''}`}
            color='primary'
            size='small'
            variant='outlined'
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        {coverages.map((coverage: Coverage) => {
          const selected = isSelected(coverage.id)

          return (
            <Grid item xs={12} md={6} key={coverage.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: selected ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: selected ? 'action.selected' : 'action.hover'
                  }
                }}
              >
                <Checkbox
                  checked={selected}
                  onChange={() => handleToggle(coverage.id)}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box display='flex' alignItems='center' gap={1} flexWrap='wrap'>
                    <Typography variant='subtitle1' fontWeight={selected ? 600 : 500}>
                      {coverage.name}
                    </Typography>
                    <Chip label={coverage.code} size='small' variant='outlined' />
                  </Box>
                  {coverage.description && (
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }} noWrap>
                      {coverage.description}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1.5 }}>
                    <TextField
                      label='Suma Asegurada'
                      type='number'
                      size='small'
                      fullWidth
                      value={getSelectedCoverage(coverage.id)?.sum_insured || '0.00'}
                      onChange={e => handleSumInsuredChange(coverage.id, e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>$</InputAdornment>
                      }}
                      inputProps={{
                        step: '0.01',
                        min: '0'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Paper>
  )
}
