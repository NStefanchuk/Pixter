import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { Post, Comment } from '../utils/types'
import PostTile from './PostTile.mui'

type ProfilePostsSectionProps = {
  posts: Post[]
  isLoading: boolean
  commentsByPostId: Record<string, Comment[]>
}

const ProfilePostsSection = ({
  posts,
  isLoading,
  commentsByPostId,
}: ProfilePostsSectionProps) => {
  return (
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
              postComments={commentsByPostId[String(post.id)] ?? []}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ProfilePostsSection
