import { useEffect, useState, useMemo } from 'react'
import { getComments, getPosts } from '../utils/api'
import { type Post, type Comment } from '../utils/types'

import {
  Box,
  Card,
  Avatar,
  Typography,
  Stack,
  Divider,
} from '@mui/material'

import Comments from '../components/Comments.mui'

const Main = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const commentsByPostId = useMemo(() => {
    const acc: Record<string, Comment[]> = {}
    for (const c of comments) {
      const key = c.postId
      if (!key) continue
      if (acc[key]) acc[key].push(c)
      else acc[key] = [c]
    }
    return acc
  }, [comments])

  useEffect(() => {
    const loadData = async () => {
      const [postsData, commentsData] = await Promise.all([
        getPosts() as Promise<Post[]>,
        getComments() as Promise<Comment[]>,
      ])
      setPosts(Array.isArray(postsData) ? postsData : [])
      setComments(Array.isArray(commentsData) ? commentsData : [])
    }
    loadData()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {posts.map((post) => {
          const author = (post as any).author
          const postComments =
            (post.id ? commentsByPostId[post.id] : undefined) ?? []
          const createdAt = post.createdAt ? new Date(post.createdAt) : null

          return (
            <Card
              key={post.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper', // тёмно-серый в dark theme
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0px 24px 64px rgba(0,0,0,0.8)',
                overflow: 'hidden',
              }}
            >
              {/* HEADER: автор + дата */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{ p: 2, pb: 1 }}
              >
                <Avatar
                  src={author?.avatarUrl || ''}
                  alt={author?.username || 'User'}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 16,
                    fontWeight: 600,
                    bgcolor: author?.avatarUrl ? undefined : 'primary.main',
                  }}
                >
                  {!author?.avatarUrl
                    ? (author?.username || 'U')[0]?.toUpperCase()
                    : undefined}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                      color: 'text.primary',
                    }}
                  >
                    {author?.username || 'Unknown'}
                  </Typography>

                  {createdAt && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.2,
                        display: 'block',
                      }}
                    >
                      {createdAt.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Typography>
                  )}

                  {post.location && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.2,
                        display: 'block',
                      }}
                    >
                      {post.location}
                    </Typography>
                  )}
                </Box>
              </Stack>

              {/* Фото */}
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={post.imageUrl}
                  alt={post.description || 'Post image'}
                  sx={{
                    width: '100%',
                    maxHeight: 600,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Описание поста */}
              {post.description && (
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    pt: 2,
                    pb: 1,
                    color: 'text.primary',
                    wordBreak: 'break-word',
                  }}
                >
                  {post.description}
                </Typography>
              )}

              <Divider sx={{ opacity: 0.12 }} />

              {/* Комментарии */}
              <Box sx={{ p: 2 }}>
                <Comments
                  postComments={postComments}
                  postId={String(post.id)}
                  className=""
                />
              </Box>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}

export default Main
