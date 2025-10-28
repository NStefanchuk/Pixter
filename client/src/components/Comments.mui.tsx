import { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  IconButton,
  Paper,
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
      className={className} // чтобы не ломать твой внешний API
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontSize: '0.9rem',
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
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          Show all {comments.length} comments
        </Button>
      )}

      {/* comments list */}
      <Stack spacing={2} sx={{ maxHeight: 240, overflowY: 'auto', pr: 1 }}>
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
                {!avatar
                  ? username?.[0]?.toUpperCase() ?? 'U'
                  : undefined}
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
                    sx={{ lineHeight: 1.2 }}
                  >
                    {username}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
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
                        bgcolor: 'text.disabled',
                        display: 'inline-block',
                      }}
                    />

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ color: 'text.secondary' }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { color: 'text.primary' },
                          fontSize: '0.7rem',
                          lineHeight: 1,
                        }}
                      >
                        <ReplyIcon sx={{ fontSize: 14 }} />
                        <Typography
                          variant="caption"
                          sx={{ lineHeight: 1 }}
                        >
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
                    color: 'text.primary',
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
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        p: 0,
                        color: 'text.secondary',
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
                      '&:hover': { color: 'text.primary' },
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
            sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}
          >
            No comments yet. Be the first!
          </Typography>
        )}
      </Stack>

      <Divider sx={{ opacity: 0.15 }} />

      {/* add comment form */}
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          p: 1,
        }}
      >
        <TextField
          type="text"
          placeholder="Add a comment..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={isSubmitting}
          variant="standard"
          fullWidth
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            fontSize: '0.9rem',
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: (theme) => theme.palette.text.disabled,
            },
          }}
        />

        <Button
          type="submit"
          variant="text"
          size="small"
          disabled={isSubmitting || !newContent.trim()}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 'auto',
            px: 1,
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default Comments
