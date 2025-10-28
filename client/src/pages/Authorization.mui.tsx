import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Box, Paper, Typography, Link, Avatar, Divider } from '@mui/material'

import Login from '../components/Login.mui'
import Registration from '../components/Registration.mui'
import logoUrl from '../assets/Logo.svg'

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

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? localStorage.getItem('color-scheme')
        : null
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const mode =
      stored === 'light' || stored === 'dark'
        ? stored
        : prefersDark
        ? 'dark'
        : 'light'
    const root = document.documentElement
    root.setAttribute('data-color-scheme', mode)
    const setVar = (k: string, v: string) => root.style.setProperty(k, v)
    if (mode === 'dark') {
      setVar('--bg-paper', '#1e1e1e')
      setVar('--bg-default', '#121212')
      setVar('--text-primary', 'rgba(255,255,255,0.87)')
      setVar('--text-secondary', 'rgba(255,255,255,0.6)')
      setVar('--text-disabled', 'rgba(255,255,255,0.38)')
      setVar('--divider', 'rgba(255,255,255,0.12)')
    } else {
      setVar('--bg-paper', '#ffffff')
      setVar('--bg-default', '#fafafa')
      setVar('--text-primary', 'rgba(0,0,0,0.87)')
      setVar('--text-secondary', 'rgba(0,0,0,0.6)')
      setVar('--text-disabled', 'rgba(0,0,0,0.38)')
      setVar('--divider', 'rgba(0,0,0,0.12)')
    }
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'var(--bg-default, #fafafa)',
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
          bgcolor: 'var(--bg-paper, #fff)',
          color: 'var(--text-primary, rgba(0,0,0,0.87))',
          border: '1px solid',
          borderColor: 'var(--divider, rgba(0,0,0,0.12))',
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
          <Box
            component="img"
            src={logoUrl}
            alt="Pixter logo"
            sx={{
              width: 72,
              height: 'auto',
              mb: 2,
              display: 'block',
              mx: 'auto',
            }}
          />

          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ lineHeight: 1.2 }}>
              {text.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}
            >
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
            color: 'var(--text-secondary, rgba(0,0,0,0.6))',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}
          >
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
