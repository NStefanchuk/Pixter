import * as React from 'react'
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  handleCloseModal: () => void
  contentClassName?: string 
}

const Modal = ({ children, isOpen, handleCloseModal }: ModalProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClose = (
    _event: object,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      handleCloseModal()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      // sx можно настроить, чтобы выглядело ближе к твоему стилю
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 24,
        },
      }}
    >
      {/* DialogContent уже даёт паддинги.
         Мы оборачиваем children в Box просто чтобы ты мог класть формы как раньше
      */}
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {children}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
