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
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import Comments from './Comments.mui'
import { type Comment } from '../utils/types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { getAuthHeaders } from '../utils/api'
import { removePost } from '../slices/posts/postsSlice'

interface PostProps {
  id: string
  imageUrl: string
  description?: string
  location?: string
  postComments?: Comment[]
  authorId: string
}

const PostTile = ({
  id,
  imageUrl,
  description,
  location,
  postComments = [],
  authorId,
}: PostProps) => {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const userData = useSelector((state: RootState) => state.user.userData)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // диалог
  const handleOpenPostModal = () => setIsOpen(true)
  const handleClosePostModal = () => setIsOpen(false)

  // меню
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // пункты меню
  const handleEdit = () => {
    handleMenuClose()
  }

  const handleDelete = async (postId: string) => {
    try {
      const headers = getAuthHeaders()

      const res = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) throw new Error('Failed to delete')
      return await res.json()
    } catch (e) {
      console.error(e)
    }
    dispatch(removePost(postId))
    handleMenuClose()
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          bgcolor: 'var(--bg-paper)',
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
            bgcolor: 'var(--bg-paper)',
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
              backgroundColor: 'var(--bg-default)',
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
            {userData?.id === authorId && (
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 48,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.6)',
                  },
                }}
                aria-label="More actions"
              >
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(id)}>Delete</MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              px: 2,
              py: 1.5,
              borderBottom: () => `1px solid var(--divider)`,
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
              <Typography
                variant="caption"
                sx={{ color: 'var(--text-secondary)' }}
              >
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
            <Comments postComments={postComments} postId={id} className="" />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostTile
