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
  TextField,
  Button,
  Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toast } from 'react-hot-toast'
import Comments from './Comments.mui'
import { type Comment, type Post } from '../utils/types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { getAuthHeaders } from '../utils/api'
import { removePost, updatePost } from '../slices/posts/postsSlice'

interface PostProps {
  id: string
  imageUrl: string
  description?: string
  location?: string
  postComments?: Comment[]
  authorId: string
  // для ленты
  showAuthor?: boolean
  authorName?: string
  authorAvatarUrl?: string
  // ⚠️ главное: если true — показываем сразу контент, без клика и модалки
  inline?: boolean
}

const PostTile = ({
  id,
  imageUrl,
  description,
  location,
  postComments = [],
  authorId,
  showAuthor,
  authorName,
  authorAvatarUrl,
  inline = false,
}: PostProps) => {
  const dispatch = useDispatch()
  const userData = useSelector((state: RootState) => state.user.userData)

  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const [isEditing, setIsEditing] = useState(false)
  const [draftDescription, setDraftDescription] = useState(description ?? '')

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const isOwner = userData?.id === authorId

  const handleOpenPostModal = () => setIsOpen(true)
  const handleClosePostModal = () => setIsOpen(false)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    setIsEditing(true)
    setDraftDescription(description ?? '')
  }

  const handleSave = async () => {
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      }

      const res = await fetch(`http://localhost:4000/posts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          description: draftDescription,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update post')
      }

      const updatedFromServer: Post = await res.json()
      dispatch(updatePost(updatedFromServer))

      setIsEditing(false)
      toast.success('Post updated')
    } catch (e) {
      console.error(e)
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      const headers = getAuthHeaders()

      const res = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) throw new Error('Failed to delete')

      dispatch(removePost(postId))
      handleMenuClose()
      setIsOpen(false)
      toast.success('Post deleted')
    } catch (e) {
      toast.error('Failed to delete post')
      return
    }
  }

  // ✨ общий контент, который мы будем рендерить и в модалке, и inline
  const renderPostBody = () => (
    <>
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
        {/* кнопка закрытия только в модалке */}
        {!inline && (
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
        )}

        {/* меню только если это наш пост */}
        {isOwner && (
          <IconButton
            onClick={handleMenuClick}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: inline ? 8 : 48,
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

      {/* описание / редактор */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1.5,
          borderBottom: () => `1px solid var(--divider)`,
        }}
      >
        {isEditing ? (
          <>
            <TextField
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              label="Description"
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setIsEditing(false)
                  setDraftDescription(description ?? '')
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          description && (
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-word', mb: location ? 0.5 : 0 }}
            >
              {description}
            </Typography>
          )
        )}

        {location && !isEditing && (
          <Typography
            variant="caption"
            sx={{ color: 'var(--text-secondary)' }}
          >
            {location}
          </Typography>
        )}
      </Box>

      {/* комментарии */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: inline ? 'visible' : 'auto',
          px: 2,
          py: 2,
        }}
      >
        <Comments postComments={postComments} postId={id} className="" />
      </Box>
    </>
  )

  // 🔁 ВАРИАНТ 1: inline — сразу всё показываем
  if (inline) {
    return (
      <Card
        variant="outlined"
        sx={{
          bgcolor: 'var(--bg-paper)',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        {/* хедер автора (для ленты) */}
        {showAuthor && (
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Avatar src={authorAvatarUrl} alt={authorName} />
            <Typography variant="body2" fontWeight={600}>
              {authorName ?? 'Unknown'}
            </Typography>
          </Box>
        )}
        {renderPostBody()}
      </Card>
    )
  }

  // 🔁 ВАРИАНТ 2: как раньше — превью + модалка
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
          {showAuthor && (
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={authorAvatarUrl} alt={authorName} />
              <Typography>{authorName}</Typography>
            </Box>
          )}
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
          {renderPostBody()}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostTile
