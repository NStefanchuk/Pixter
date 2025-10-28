import { useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import Comments from './Comments.mui'
import { type User, type Comment } from '../utils/types'

interface PostProps {
  id: string
  imageUrl: string
  description?: string
  location?: string
  usersById?: Map<User['id'], User>
  postComments?: Comment[]
}

const PostTile = ({
  id,
  imageUrl,
  description,
  location,
  usersById = new Map<User['id'], User>(),
  postComments = [],
}: PostProps) => {
  // NOTE: comments array from old code не использовался по факту, так что мы его не трогаем логически

  const [isOpen, setIsOpen] = useState(false)
  const handleOpenPostModal = () => {
    setIsOpen(true)
  }
  const handleClosePostModal = () => {
    setIsOpen(false)
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {/* превью-карточка поста в сетке профайла */}
      <Card
        variant="outlined"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <CardActionArea onClick={handleOpenPostModal}>
          <CardMedia
            component="img"
            src={imageUrl}
            alt={description || 'Photo'}
            loading="lazy"
            sx={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          />
        </CardActionArea>
      </Card>

      {/* полноэкранный просмотр поста */}
      <Dialog
        open={isOpen}
        onClose={handleClosePostModal}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 2,
            overflow: 'hidden',
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: 'background.default',
          }}
        >
          {/* левая часть: картинка */}
          <Box
            sx={{
              flex: 2,
              bgcolor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 240, md: 400 },
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={description || 'Photo'}
              loading="lazy"
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* правая часть: инфо + комменты */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 280,
              maxWidth: 360,
              bgcolor: 'background.paper',
              borderLeft: {
                xs: 'none',
                md: `1px solid ${theme.palette.divider}`,
              },
              p: 2,
              position: 'relative',
            }}
          >
            {/* header с кнопкой закрытия */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <IconButton
                onClick={handleClosePostModal}
                size="small"
                sx={{
                  color: 'text.secondary',
                }}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* описание / локация */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              {description && (
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {description}
                </Typography>
              )}

              {location && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {location}
                </Typography>
              )}
            </Stack>

            {/* comments */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                p: 1,
              }}
            >
              <Comments
                postComments={postComments}
                usersById={usersById}
                postId={id}
                className=""
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostTile
