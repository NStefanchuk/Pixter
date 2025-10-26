import { useEffect, useState, useMemo } from 'react'
import { getComments, getPosts } from '../utils/api'
import { type Post, type Comment } from '../utils/types'
import styles from '../styles/feed.module.css'
import Comments from '../components/Comments'

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
    <div className={styles.feed}>
      {posts.map((post) => {
        const author = (post as any).author

        const postComments =
          (post.id ? commentsByPostId[post.id] : undefined) ?? []

        const createdAt = post.createdAt ? new Date(post.createdAt) : null

        return (
          <article className={styles.post} key={post.id}>
            <header className={styles.header}>
              <img
                className={styles.avatar}
                src={author?.avatarUrl || ''}
                alt={author?.username || 'User'}
              />
              <span className={styles.username}>
                {author?.username || 'Unknown'}
              </span>
            </header>

            {post.location && (
              <p className={styles.location}>{post.location}</p>
            )}

            {createdAt && (
              <time className={styles.date} dateTime={createdAt.toISOString()}>
                {createdAt.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            )}

            <img
              className={styles.photo}
              src={post.imageUrl}
              alt={post.description || 'Post image'}
            />

            {post.description && (
              <p className={styles.desc}>{post.description}</p>
            )}

            <div className={styles.commentsSection}>
              <Comments
                postComments={postComments}
                postId={String(post.id)}
                className={styles.commentsInFeed}
              />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default Main
