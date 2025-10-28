import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Box, Paper, Typography, Link, Avatar, Divider } from '@mui/material'

import Login from '../components/Login.mui'
import Registration from '../components/Registration'
import logoUrl from '../assets/logo.png'

const Authorization = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  })

  const authDict = {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue',
      switchQuestion: 'Don’t have an account?',
      switchAction: 'Sign up',
    },
    register: {
      title: 'Create your account',
      subtitle: 'Join the community and start sharing',
      switchQuestion: 'Already have an account?',
      switchAction: 'Sign in',
    },
  } as const

  const text = isLogin ? authDict.login : authDict.register

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Fill all the fields')
      }
      setIsLoading(true)

      const submitData = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const res = await submitData.json()
      console.log(res)
      toast.success('Account created!')
    } catch (error) {
      console.error(error)
      toast.error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const email = userLogin.email.trim().toLowerCase()
      const password = userLogin.password

      const resp = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || 'Invalid email or password')
      }

      const { user, token } = await resp.json()

      localStorage.setItem('pixter:auth', JSON.stringify({ user, token }))
      toast.success('You are logged in successfully')
      navigate('/profile')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            src={logoUrl}
            alt="Logo"
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'transparent',
            }}
          />

          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {text.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {text.subtitle}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ opacity: 0.12 }} />

        <Box
          component="form"
          onSubmit={isLogin ? handleLogin : handleSubmitRegister}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {isLogin ? (
            <Login
              isLoading={isLoading}
              userLogin={userLogin}
              setUserLogin={setUserLogin}
            />
          ) : (
            <Registration
              userData={userData}
              setUserData={setUserData}
              isLoading={isLoading}
            />
          )}
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {text.switchQuestion}{' '}
            <Link
              href="#"
              underline="hover"
              onClick={(e) => {
                e.preventDefault()
                setIsLogin(!isLogin)
              }}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {text.switchAction}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Authorization
