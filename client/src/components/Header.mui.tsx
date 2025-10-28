import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material'
import logo from '../assets/Logo.svg'

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
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
            component="img"
            src={logo}
            alt="Pixter logo"
            sx={{
              width: 42,
              height: 42,
              borderRadius: 1,
              display: 'block',
              boxShadow: '0 8px 20px rgba(156,39,176,0.4)',
            }}
          />

          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: 600,
              lineHeight: 1,
              color: 'text.primary',
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
          <Button
            component={Link}
            to="/profile"
            variant="text"
            size="small"
            sx={{
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              px: 1.5,
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              },
            }}
          >
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
