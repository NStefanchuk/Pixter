import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts, getUser, createPost } from '../utils/api'
import PostTile from '../components/PostTile.mui'
import { type Post } from '../utils/types'

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

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

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
        bgcolor: 'background.default',
        color: 'text.primary',
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
        {/* ===== PROFILE HEADER ===== */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
        >
          {/* avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user?.avatarUrl ? (
              <Avatar
                src={user.avatarUrl}
                alt={`${user?.username} avatar`}
                sx={{ width: 96, height: 96, fontSize: 32, fontWeight: 600 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                }}
              >
                {user?.username?.[0]?.toUpperCase() ?? '?'}
              </Avatar>
            )}
          </Box>

          {/* right side info */}
          <Stack
            spacing={2}
            flex={1}
            sx={{ width: '100%', maxWidth: '100%' }}
          >
            {/* username + stats */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ wordBreak: 'break-word' }}
              >
                {user?.username ?? '—'}
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                sx={{ mt: 1, flexWrap: 'wrap' }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.postsCount ?? 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Posts
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.followersCount ?? 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Followers
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.followingCount ?? 0}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Following
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* bio / email / join date */}
            <Box sx={{ maxWidth: 500 }}>
              {user?.bio ? (
                <Typography variant="body2">{user.bio}</Typography>
              ) : null}

              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', wordBreak: 'break-all' }}
              >
                {user?.email}
              </Typography>

              {user?.createdAt && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  Joined:{' '}
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              )}
            </Box>

            {/* actions */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={handleOpenModal}
              >
                Add new post
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ opacity: 0.15 }} />

        {/* ===== POSTS GRID (пока черновик, без CSS) ===== */}
        <Box>
          {isLoading ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ color: 'text.secondary' }}
            >
              <CircularProgress size={20} />
              <Typography variant="body2">Loading…</Typography>
            </Stack>
          ) : posts.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No posts yet
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <PostTile
                    id={post.id}
                    imageUrl={post.imageUrl}
                    description={post.description}
                    location={post.location}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* ===== CREATE POST DIALOG ===== */}
        <Dialog open={isOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>Add new post</DialogTitle>
          <Box component="form" onSubmit={handlePostImage}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
