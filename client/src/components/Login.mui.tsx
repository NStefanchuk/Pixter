import * as React from 'react'
import { Box, TextField, Button } from '@mui/material'

type TLoginProps = {
  userLogin: { email: string; password: string }
  setUserLogin: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >
  isLoading: boolean
}

const Login = ({ userLogin, setUserLogin, isLoading }: TLoginProps) => {
  const handleChangeUserData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setUserLogin({ ...userLogin, [name]: value })
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
    >
      <TextField
        placeholder="Email"
        label="Email"
        type="text"
        name="email"
        value={userLogin.email}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
        sx={{
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
        }}
      />

      <TextField
        placeholder="Password"
        label="Password"
        type="password"
        name="password"
        value={userLogin.password}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
        sx={{
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
        }}
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
        Login
      </Button>
    </Box>
  )
}

export default Login
