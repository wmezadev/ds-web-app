'use client'

import React, { useState, useEffect } from 'react'

import {
  Box,
  Paper,
  Typography,
  List,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Checkbox,
  ListItemButton,
  ListItemText
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import { useInsuranceCoverages } from '../hooks/useInsuranceCoverages'
import type { Coverage } from '@/types/coverage'

interface CoveragesProps {
  insuranceLineId: number | null
  selectedCoverageIds?: number[]
  onSelectionChange?: (coverageIds: number[]) => void
}

export default function Coverages({ insuranceLineId, selectedCoverageIds = [], onSelectionChange }: CoveragesProps) {
  const { coverages, loading, error } = useInsuranceCoverages({
    insuranceLineId,
    enabled: !!insuranceLineId
  })

  const [selected, setSelected] = useState<number[]>(selectedCoverageIds)

  useEffect(() => {
    setSelected(selectedCoverageIds)
  }, [selectedCoverageIds])

  useEffect(() => {
    if (insuranceLineId) {
      setSelected([])
      onSelectionChange?.([])
    }
  }, [insuranceLineId])

  const handleToggle = (coverageId: number) => {
    const newSelected = selected.includes(coverageId)
      ? selected.filter(id => id !== coverageId)
      : [...selected, coverageId]

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

  const isSelected = (coverageId: number) => selected.includes(coverageId)

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

      <List>
        {coverages.map((coverage: Coverage, index: number) => {
          const selected = isSelected(coverage.id)

          return (
            <React.Fragment key={coverage.id}>
              {index > 0 && <Divider />}
              <ListItemButton
                onClick={() => handleToggle(coverage.id)}
                sx={{
                  py: 2,
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: selected ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: selected ? 'action.selected' : 'action.hover'
                  }
                }}
              >
                <Checkbox
                  edge='start'
                  checked={selected}
                  tabIndex={-1}
                  disableRipple
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{ mr: 2 }}
                />
                <ListItemText
                  primary={
                    <Box display='flex' alignItems='center' gap={1}>
                      <Typography variant='subtitle1' fontWeight={selected ? 600 : 500}>
                        {coverage.name}
                      </Typography>
                      <Chip label={coverage.code} size='small' variant='outlined' />
                    </Box>
                  }
                  secondary={
                    <Box mt={0.5}>
                      {coverage.description && (
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                          {coverage.description}
                        </Typography>
                      )}
                      <Box display='flex' gap={1} flexWrap='wrap'>
                        {coverage.sum_insured && (
                          <Chip
                            label={`Suma Asegurada: ${coverage.sum_insured}`}
                            size='small'
                            variant='outlined'
                            color='info'
                          />
                        )}
                        {coverage.premium && (
                          <Chip
                            label={`Prima: ${coverage.premium}`}
                            size='small'
                            variant='outlined'
                            color='secondary'
                          />
                        )}
                        {coverage.deductible && (
                          <Chip
                            label={`Deducible: ${coverage.deductible}`}
                            size='small'
                            variant='outlined'
                            color='warning'
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            </React.Fragment>
          )
        })}
      </List>
    </Paper>
  )
}
