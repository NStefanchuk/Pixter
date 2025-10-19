import { useEffect, useState } from 'react'
import { getComments, getPosts, getUsers } from '../utils/api'
import { type Post, type User, type Comment } from '../utils/types'
import styles from '../styles/feed.module.css'
import Comments from '../components/Comments'

const Main = () => {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const usersById = new Map<User['id'], User>(users.map((u) => [u.id, u]))

  const commentsByPostId = comments.reduce((acc, el) => {
    if (Object.hasOwn(acc, el.postId)) {
      acc[el.postId].push(el)
    } else {
      acc[el.postId] = [el]
    }
    return acc
  }, {})
  console.log(commentsByPostId)

  console.log(usersById)
  useEffect(() => {
    const getMainData = async () => {
      const [usersData, postsData, commentsData] = await Promise.all([
        getUsers(),
        getPosts(),
        getComments(),
      ])
      setUsers(usersData)
      setPosts(postsData)
      setComments(commentsData)
    }
    getMainData()
  }, [])

  return (
    <div className={styles.feed}>
      {posts.map((post) => {
        const author = usersById.get(post.userId)
        const postComments = commentsByPostId[post.id] || []

        return (
          <article className={styles.post} key={post.id}>
            <header className={styles.header}>
              <img
                className={styles.avatar}
                src={author?.avatarUrl}
                alt={author?.username || 'User'}
              />
              <span className={styles.username}>
                {author?.username || 'Unknown'}
              </span>
            </header>
            {post.location && (
              <p className={styles.location}>{post.location}</p>
            )}

            <time className={styles.date} dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </time>
            <img
              className={styles.photo}
              src={post.imageUrl}
              alt={post.description || 'Post image'}
            />

            {post.description && (
              <p className={styles.desc}>{post.description}</p>
            )}
            <div>
              <Comments postComments={postComments} usersById={usersById} />
            </div>
          </article>
        )
      })}
    </div>
  )
}
export default Main
