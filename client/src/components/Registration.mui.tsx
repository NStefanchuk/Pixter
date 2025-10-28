import * as React from 'react'
import { Box, TextField, Button } from '@mui/material'

type TRegistrationProps = {
  userData: { username: string; email: string; password: string }
  setUserData: React.Dispatch<
    React.SetStateAction<{
      username: string
      email: string
      password: string
    }>
  >
  isLoading: boolean
}

const Registration = ({
  userData,
  setUserData,
  isLoading,
}: TRegistrationProps) => {
  const handleChangeUserData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const fieldSx = {
    '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiOutlinedInput-root': {
      bgcolor: 'var(--bg-paper, #fff)',
      color: 'var(--text-primary, rgba(0,0,0,0.87))',
      '& .MuiInputBase-input::placeholder': {
        color: 'var(--text-secondary, rgba(0,0,0,0.6))',
        opacity: 1,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--divider, rgba(0,0,0,0.23))',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--text-secondary, rgba(0,0,0,0.6))',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
    },
  } as const

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
    >
      <TextField
        placeholder="Username"
        label="Username"
        type="text"
        name="username"
        value={userData.username}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
        sx={fieldSx}
      />

      <TextField
        placeholder="Email"
        label="Email"
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
        sx={fieldSx}
      />

      <TextField
        placeholder="Password"
        label="Password"
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
        sx={fieldSx}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          bgcolor: 'primary.main',
          color: '#fff',
          '&:hover': { bgcolor: 'primary.dark' },
          '&.Mui-disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled',
          },
        }}
      >
        {isLoading ? 'Loading…' : 'Register'}
      </Button>
    </Box>
  )
}

export default Registration
