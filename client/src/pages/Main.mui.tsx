import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'

import { getComments, getPosts } from '../utils/api'
import { type Post, type Comment } from '../utils/types'
import { RootState } from '../store/store'
import PostTile from '../components/PostTile.mui'

const Main = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const userData = useSelector((state: RootState) => state.user.userData)

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
        bgcolor: 'var(--bg-default, #fafafa)',
        color: 'var(--text-primary, rgba(0,0,0,0.87))',
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
          const postComments =
            (post.id ? commentsByPostId[post.id] : undefined) ?? []

          return (
            <PostTile
              key={post.id}
              id={post.id}
              imageUrl={post.imageUrl}
              description={post.description}
              location={post.location}
              postComments={postComments}
              authorId={post.author?.id ?? ''}
              authorName={post.author?.username}
              authorAvatarUrl={post.author?.avatarUrl}
              showAuthor
              inline
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default Main
