import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
} from '@mui/material'
import { RiCameraLensFill } from 'react-icons/ri'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Header = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored =
      typeof window !== 'undefined'
        ? localStorage.getItem('color-scheme')
        : null
    if (stored === 'light' || stored === 'dark') return stored
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  const userData = useSelector((state: RootState) => state.user.userData)
  const location = useLocation()
  const isOnProfile = location.pathname.startsWith('/profile')

  useEffect(() => {
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
    try {
      localStorage.setItem('color-scheme', mode)
    } catch {}
  }, [mode])

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        bgcolor: 'var(--bg-paper)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid',
        borderColor: 'var(--divider)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 56,
        }}
      >
        {/* LOGO + BRAND */}
        <Box
          component={Link}
          to="/feed"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            gap: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
            aria-label="Pixter logo"
          >
            <RiCameraLensFill size={48} />
          </Box>

          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: 600,
              lineHeight: 1,
              color: 'var(--text-primary)',
            }}
          >
            Pixter
          </Typography>
        </Box>

        {/* NAV */}
        <Box
          component="nav"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {!isOnProfile && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              component={Link}
              to="/profile"
              sx={{ textDecoration: 'none', color: 'var(--text-primary)' }}
            >
              <Avatar src={userData?.avatarUrl} />
              <Typography>{userData?.username}</Typography>
            </Stack>
          )}

          <Tooltip
            title={
              mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            <IconButton
              onClick={toggleMode}
              size="small"
              aria-label="Toggle color mode"
              sx={{ ml: 0.5, color: 'var(--text-primary)' }}
            >
              {mode === 'dark' ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
