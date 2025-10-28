import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button } from '@mui/material'
import logoUrl from '../assets/Logo_t.svg'

const Welcome = () => {
  const navigate = useNavigate()

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
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--bg-default, #fafafa)',
        color: 'var(--text-primary, rgba(0,0,0,0.87))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          bgcolor: 'var(--bg-paper, #fff)',
          color: 'var(--text-primary, rgba(0,0,0,0.87))',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'var(--divider, rgba(0,0,0,0.12))',
          boxShadow: '0px 32px 64px rgba(0,0,0,0.8)',
          px: 3,
          py: 4,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logoUrl}
          alt="Pixter logo"
          loading="eager"
          decoding="async"
          sx={{
            width: 164,
            height: 64,
            borderRadius: 2,
            mx: 'auto',
            mb: 2,
            display: 'block',
            filter: 'drop-shadow(0 8px 20px rgba(156,39,176,0.5))',
          }}
        />

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 1, color: 'text.primary' }}
        >
          Create. Capture. Connect.
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: 'var(--text-secondary, rgba(0,0,0,0.6))',
            lineHeight: 1.5,
          }}
        >
          A social hub for photographers — share your work, get feedback, and
          grow together.
        </Typography>

        {/* CTA Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            py: 1.2,
          }}
          onClick={() => navigate('/auth')}
        >
          Get started
        </Button>

        {/* Hint */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 2.5,
            color: 'var(--text-secondary, rgba(0,0,0,0.6))',
          }}
        >
          Join now and be part of a creative community.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Welcome
