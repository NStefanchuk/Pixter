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
  contentClassName?: string // мы его сохраним в пропсах ради совместимости, но не будем применять классы
}

const Modal = ({
  children,
  isOpen,
  handleCloseModal,
}: ModalProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // Поведение Escape уже встроено в MUI Dialog (onClose вызывается).
  // Блокировка прокрутки body тоже встроена.

  const handleClose = (
    _event: object,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    // хотим то же поведение, что у тебя было:
    // - клик по фону закрывает
    // - Escape закрывает
    // => оба случая зовут handleCloseModal
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
