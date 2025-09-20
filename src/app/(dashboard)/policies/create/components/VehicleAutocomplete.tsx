'use client'

import React from 'react'

import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material'

import { useVehicleSearch } from '../hooks/useVehicleSearch'
import type { Vehicle } from '@/types/vehicle'

interface VehicleAutocompleteProps {
  label: string
  value: number | null
  onChange: (id: number | null) => void
  error?: boolean
  helperText?: string
}

export function VehicleAutocomplete({ label, value, onChange, error, helperText }: VehicleAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const { results: options, loading } = useVehicleSearch(inputValue, open || inputValue.length > 0)

  const selectedOption = React.useMemo(() => {
    if (!value || options.length === 0) return null

    return options.find(option => option.id === value) || null
  }, [value, options])

  return (
    <Autocomplete<Vehicle>
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      value={selectedOption}
      getOptionLabel={option => `${option.license_plate} - ${option.brand.name} ${option.model.name}`.trim()}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.id : null)
      }}
      renderOption={(props, option) => (
        <Box component='li' {...props}>
          <Typography variant='body2'>
            <strong>{option.license_plate}</strong> - {option.brand.name} {option.model.name} - {option.color}
          </Typography>
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
