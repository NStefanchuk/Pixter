import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material'
import logoUrl from '../assets/Logo_t.svg'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
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
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
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
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          A social hub for photographers — share your work, get feedback,
          and grow together.
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
            color: 'text.secondary',
          }}
        >
          Join now and be part of a creative community.
        </Typography>
      </Paper>
    </Box>
  )
}

export default Welcome
