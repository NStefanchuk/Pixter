import { Avatar, Box, Button, Stack, Typography } from '@mui/material'

type ProfileHeaderProps = {
  user: {
    username: string
    avatarUrl?: string
    bio?: string
    email: string
    createdAt?: string
    postsCount: number
    followersCount: number
    followingCount: number
  } | null

  onLogout: () => void
  onAddPostClick: () => void
}

const ProfileHeader = ({
  user,
  onLogout,
  onAddPostClick,
}: ProfileHeaderProps) => {
  if (!user) return null

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      alignItems={{ xs: 'center', sm: 'flex-start' }}
    >
      {/* avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={user.avatarUrl}
          alt={`${user.username} avatar`}
          sx={{
            width: 96,
            height: 96,
            fontSize: 32,
            fontWeight: 600,
            bgcolor: user.avatarUrl ? undefined : 'primary.main',
          }}
        >
          {!user.avatarUrl && user.username[0]?.toUpperCase()}
        </Avatar>
      </Box>

      {/* info + actions */}
      <Stack spacing={2} flex={1} sx={{ width: '100%' }}>
        {/* username + stats */}
        <Box>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ wordBreak: 'break-word' }}
          >
            {user.username}
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mt: 1, flexWrap: 'wrap' }}>
            <UserStat label="Posts" value={user.postsCount} />
            <UserStat label="Followers" value={user.followersCount} />
            <UserStat label="Following" value={user.followingCount} />
          </Stack>
        </Box>

        {/* bio / email / joined */}
        <Box sx={{ maxWidth: 500 }}>
          {user.bio && <Typography variant="body2">{user.bio}</Typography>}
          <Typography
            variant="body2"
            sx={{ opacity: 0.9, wordBreak: 'break-all' }}
          >
            {user.email}
          </Typography>
          {user.createdAt && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
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
            onClick={onLogout}
          >
            Logout
          </Button>
          <Button variant="contained" size="small" onClick={onAddPostClick}>
            Add new post
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

const UserStat = ({ label, value }: { label: string; value: number }) => (
  <Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ opacity: 0.8 }}>
      {label}
    </Typography>
  </Box>
)

export default ProfileHeader
