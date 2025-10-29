import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts, getUser, createPost, getComments } from '../utils/api'
import PostTile from '../components/PostTile.mui'
import { type Post, type Comment } from '../utils/types'

import {
  Box,
  Avatar,
  Typography,
  Stack,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material'
import ProfileHeader from '../components/ProfileHeader.mui'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([]) // добавлено

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // auth check + load user
  useEffect(() => {
    const authRaw = localStorage.getItem('pixter:auth')
    if (!authRaw) {
      navigate('/auth')
      return
    }

    const fetchUser = async () => {
      try {
        const me = await getUser()
        setUser(me)
      } catch (err) {
        console.error(err)
        navigate('/auth')
      }
    }

    fetchUser()
  }, [navigate])

  // load posts for this user
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const allPosts = await getPosts()
        const mine = Array.isArray(allPosts)
          ? allPosts.filter((p: any) => p.author?.id === user.id)
          : []
        setPosts(mine)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyPosts()
  }, [user])

  // load comments (once we have a user)
  useEffect(() => {
    const loadComments = async () => {
      if (!user) return
      try {
        const all = await getComments()
        setComments(Array.isArray(all) ? all : [])
      } catch (err) {
        console.error(err)
      }
    }
    loadComments()
  }, [user])

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

  const handleLogout = () => {
    localStorage.removeItem('pixter:auth')
    navigate('/')
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handlePostImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formImageUrl = (formData.get('imageUrl') ?? '').toString().trim()
    const formDescription = (formData.get('description') ?? '')
      .toString()
      .trim()

    if (!formImageUrl) return

    const payload = {
      imageUrl: formImageUrl,
      description: formDescription || undefined,
    }

    setIsSubmitting(true)

    try {
      const createdPost = await createPost(payload)
      if (createdPost?.author?.id === user?.id) {
        setPosts((prev) => [createdPost, ...prev])
      } else {
        const allPosts = await getPosts()
        const mine = Array.isArray(allPosts)
          ? allPosts.filter((p: any) => p.author?.id === user.id)
          : []
        setPosts(mine)
      }

      handleCloseModal()
      e.currentTarget.reset()
      setImageUrl('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--bg-default, #fafafa)',
        color: 'var(--text-primary, rgba(0,0,0,0.87))',
        py: 4,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <ProfileHeader
          user={user}
          onLogout={handleLogout}
          onAddPostClick={handleOpenModal}
        />

        <Divider sx={{ opacity: 0.15 }} />

        {/* ===== POSTS GRID (пока черновик, без CSS) ===== */}
        <Box>
          {isLoading ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}
            >
              <CircularProgress size={20} />
              <Typography variant="body2">Loading…</Typography>
            </Stack>
          ) : posts.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}
            >
              No posts yet
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 0.1,
              }}
            >
              {posts.map((post) => (
                <PostTile
                  key={post.id}
                  id={post.id}
                  imageUrl={post.imageUrl}
                  description={post.description}
                  location={post.location}
                  postComments={commentsByPostId[String(post.id)] ?? []} // добавлено
                />
              ))}
            </Box>
          )}
        </Box>

        {/* ===== CREATE POST DIALOG ===== */}
        <Dialog
          open={isOpen}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add new post</DialogTitle>
          <Box component="form" onSubmit={handlePostImage}>
            <DialogContent
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                id="imageUrl"
                name="imageUrl"
                label="Image URL *"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={handleImageUrl}
                fullWidth
                required
              />

              <TextField
                id="description"
                name="description"
                label="Description (optional)"
                placeholder="Add a short description…"
                multiline
                rows={3}
                fullWidth
              />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseModal}
                color="inherit"
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || imageUrl.trim() === ''}
              >
                {isSubmitting ? 'Adding…' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Profile
