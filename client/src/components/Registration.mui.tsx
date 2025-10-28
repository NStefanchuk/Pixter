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
        placeholder="Username"
        label="Username"
        type="text"
        name="username"
        value={userData.username}
        onChange={handleChangeUserData}
        fullWidth
        variant="outlined"
        size="medium"
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
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        {isLoading ? 'Loading…' : 'Register'}
      </Button>
    </Box>
  )
}

export default Registration
