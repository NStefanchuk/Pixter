import { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Divider,
} from '@mui/material'
import { createComment } from '../utils/api'
import { type Comment } from '../utils/types'
import ReplyIcon from '@mui/icons-material/Reply'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

interface CommentsProps {
  postComments: Comment[]
  visibleCount?: number
  onShowAll?: () => void
  className?: string
  postId: string
}

const Comments = ({
  postComments,
  visibleCount = 2,
  onShowAll,
  className = '',
  postId,
}: CommentsProps) => {
  const [expanded, setExpanded] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(postComments)

  useEffect(() => {
    setComments(postComments)
    setExpanded(false)
  }, [postComments])

  const handleShowAll = () => {
    if (onShowAll) onShowAll()
    else setExpanded(true)
  }

  const list = expanded ? comments : comments.slice(0, visibleCount)

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        fontSize: '0.9rem',
        bgcolor: 'var(--bg-paper)',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'var(--divider)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: 2,
          pt: 1.5,
        }}
      >
        {/* Show all button */}
        {!expanded && comments.length > visibleCount && (
          <Button
            onClick={handleShowAll}
            variant="text"
            size="small"
            sx={{
              alignSelf: 'flex-start',
              p: 0,
              minWidth: 'auto',
              textTransform: 'none',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              '&:hover': { color: 'var(--text-primary)' },
              mb: 1,
            }}
          >
            Show all {comments.length} comments
          </Button>
        )}

        {/* comments list */}
        <Stack spacing={2} sx={{ pr: 1 }}>
          {list.map((cmt) => {
            const author = (cmt as any).author
            const username = author?.username || 'User'
            const avatar = author?.avatarUrl || ''
            const createdAt = cmt.createdAt
              ? new Date(String(cmt.createdAt))
              : null

            return (
              <Stack
                key={cmt.id}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >
                {/* avatar */}
                <Avatar
                  src={avatar}
                  alt={username}
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    fontWeight: 600,
                    bgcolor: avatar ? undefined : 'primary.main',
                  }}
                >
                  {!avatar ? username?.[0]?.toUpperCase() ?? 'U' : undefined}
                </Avatar>

                {/* comment body */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* header row */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ lineHeight: 1.2, color: 'var(--text-primary)' }}
                    >
                      {username}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        lineHeight: 1.2,
                      }}
                    >
                      {createdAt && (
                        <time dateTime={createdAt.toISOString()}>
                          {createdAt.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      )}

                      {/* dot separator */}
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          bgcolor: 'var(--text-disabled)',
                          display: 'inline-block',
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ color: 'var(--text-secondary)' }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { color: 'var(--text-primary)' },
                            fontSize: '0.7rem',
                            lineHeight: 1,
                          }}
                        >
                          <ReplyIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ lineHeight: 1 }}>
                            Reply
                          </Typography>
                        </Stack>
                      </Stack>
                    </Typography>
                  </Stack>

                  {/* content */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      mt: 0.5,
                      maxHeight: 80,
                      overflow: 'hidden',
                    }}
                  >
                    {cmt.content}
                  </Typography>

                  {/* actions row */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      mt: 0.5,
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'var(--text-primary)' },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          p: 0,
                          color: 'var(--text-secondary)',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography variant="caption">Like</Typography>
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'var(--text-primary)' },
                      }}
                    >
                      Reply
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            )
          })}

          {comments.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-secondary)',
                textAlign: 'center',
                py: 4,
              }}
            >
              No comments yet. Be the first!
            </Typography>
          )}
        </Stack>
      </Box>

      <Divider sx={{ opacity: 0.15 }} />
      <Box
        component="form"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!newContent.trim()) return

          setIsSubmitting(true)
          try {
            const payload = {
              postId,
              content: newContent.trim(),
            }

            const saved = await createComment(payload)

            if (saved) {
              setComments((xs) => [...xs, saved])
            } else {
              console.warn('createComment returned empty response')
            }

            setNewContent('')
            if (!expanded) setExpanded(true)
          } catch (err) {
            console.error(err)
          } finally {
            setIsSubmitting(false)
          }
        }}
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
        }}
      >
        <TextField
          type="text"
          placeholder="Add a comment..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={isSubmitting}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'var(--bg-paper, #fff)',
              color: 'var(--text-primary, rgba(0,0,0,0.87))',
              '& .MuiInputBase-input::placeholder': {
                color: 'var(--text-secondary, rgba(0,0,0,0.6))',
                opacity: 1,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--divider, rgba(0,0,0,0.23))',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--text-secondary, rgba(0,0,0,0.6))',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          disabled={isSubmitting || !newContent.trim()}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 'auto',
            px: 1.5,
            borderRadius: 1,
            // нормальное состояние пусть будет просто primary
            '&.Mui-disabled': {
              bgcolor: 'rgba(0,0,0,0.06)', // светло-серый фон в лайт теме
              color: 'text.disabled',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default Comments
