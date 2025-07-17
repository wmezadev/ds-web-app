'use client'

import React from 'react'
import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  extraActions?: React.ReactNode
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Buscar...', value, onChange, onClear, extraActions }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        fullWidth
        variant='outlined'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon color='action' />
            </InputAdornment>
          ),
          endAdornment: value && onClear && (
            <InputAdornment position='end'>
              <IconButton onClick={onClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {extraActions}
    </Box>
  )
}

export default SearchBar
