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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <TextField
        label="Email"
        type="email"
        name="email"
        value={userLogin.email}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        value={userLogin.password}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
      />

      <Button
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Login
      </Button>
    </Box>
  )
}

export default Login
