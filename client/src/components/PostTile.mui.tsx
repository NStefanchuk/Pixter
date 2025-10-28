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

      <Dialog
        open={isOpen}
        onClose={handleClosePostModal}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            height: fullScreen ? '100vh' : 600,
            maxHeight: fullScreen ? '100vh' : 600,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              flexShrink: 0,
              height: 300,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'background.default',
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={description || 'Photo'}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <IconButton
              onClick={handleClosePostModal}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: '#fff',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)',
                },
              }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              px: 2,
              py: 1.5,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {description && (
              <Typography
                variant="body2"
                sx={{ wordBreak: 'break-word', mb: location ? 0.5 : 0 }}
              >
                {description}
              </Typography>
            )}

            {location && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {location}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 2,
              py: 2,
            }}
          >
            <Comments
              postComments={postComments}
              usersById={usersById}
              postId={id}
              className=""
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostTile
