import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getComments, getPosts, getUsers } from '../utils/api'
import Styles from '../styles/profile.module.css'
import Modal from '../components/Modal'
import ModalStyles from '../styles/modal.module.css'
import PostTile from '../components/PostTile'
import { type Post, type User, type Comment } from '../utils/types'
import { getUser, STORED_USER_ID } from '../utils/api'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const usersById = useMemo(
    () => new Map<User['id'], User>(users.map((u) => [u.id, u])),
    [users]
  )

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
    const getMainData = async () => {
      const [usersData, postsData, commentsData] = await Promise.all([
        getUsers() as Promise<User[]>,
        getPosts() as Promise<Post[]>,
        getComments() as Promise<Comment[]>,
      ])
      setUsers(usersData)
      setPosts(postsData)
      setComments(commentsData)
    }
    getMainData()
  }, [])

  useEffect(() => {
    console.log(STORED_USER_ID)
    if (!STORED_USER_ID) {
      navigate('/auth')
      return
    }
    const getUserData = async () => {
      const userData = await getUser()
      setUser(userData)
    }
    getUserData()
  }, [STORED_USER_ID, navigate])

  useEffect(() => {
    setIsLoading(true)
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/posts?userId=${STORED_USER_ID}`
        )
        const data = await res.json()
        if (!ignore) setPosts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [STORED_USER_ID])

  const handleLogout = () => {
    localStorage.removeItem('pixter:user')
    navigate('/auth')
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
    try {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const formImageUrl = (formData.get('imageUrl') ?? '').toString().trim()
      const formDescription = (formData.get('description') ?? '')
        .toString()
        .trim()
      const formLocation = (formData.get('location') ?? '').toString().trim()

      const newPost = {
        userId: STORED_USER_ID,
        imageUrl: formImageUrl,
        description: formDescription,
        location: formLocation,
        createdAt: new Date().toISOString(),
      }

      setIsSubmitting(true)
      const submitData = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      const res = await submitData.json()
      const req = await fetch(
        `http://localhost:3000/posts?userId=${STORED_USER_ID}`
      )
      const data = await req.json()
      setPosts(data)
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
    <>
      <div className={Styles.profilePage}>
        <div className={Styles.profileContainer}>
          <div className={Styles.profileHeader}>
            <div className={Styles.profileAvatar}>
              {user?.avatarUrl ? (
                <img
                  className={Styles.avatarImg}
                  src={user.avatarUrl}
                  alt={`${user.username} avatar`}
                />
              ) : (
                <div className={Styles.avatarFallback} aria-hidden>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className={Styles.profileInfo}>
              <div className={Styles.profileTopRow}>
                <h1 className={Styles.username}>{user?.username}</h1>
              </div>

              <div className={Styles.stats}>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user?.posts ?? 0}</span>
                  <span className={Styles.statLabel}>Posts</span>
                </div>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user?.followers}</span>
                  <span className={Styles.statLabel}>Followers</span>
                </div>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user?.following}</span>
                  <span className={Styles.statLabel}>Following</span>
                </div>
              </div>

              <p className={Styles.bio}>{user?.bio ?? ''}</p>
              <p className={Styles.email}>{user?.email}</p>
              <p className={Styles.meta}>
                Joined: {new Date(user?.createdAt).toLocaleDateString()}
              </p>

              <div className={Styles.profileActions}>
                <button className={Styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
                <button className={Styles.logoutBtn} onClick={handleOpenModal}>
                  Add new post
                </button>
              </div>
            </div>
          </div>
          <section className={Styles.profilePosts}>
            {isLoading ? (
              <p>«Loading…»</p>
            ) : posts.length === 0 ? (
              <p>«No posts yet»</p>
            ) : (
              posts.map((post) => {
                const postComments = commentsByPostId[post.id] ?? []
                return (
                  <PostTile
                    key={post.id}
                    id={post.id}
                    imageUrl={post.imageUrl}
                    description={post.description}
                    location={post.location}
                    usersById={usersById}
                    postComments={postComments}
                  />
                )
              })
            )}
          </section>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} handleCloseModal={handleCloseModal}>
          <form onSubmit={handlePostImage}>
            <div className={ModalStyles.formRow}>
              <label className={ModalStyles.label} htmlFor="imageUrl">
                Image URL *
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                type="url"
                placeholder="https://example.com/photo.jpg"
                className={ModalStyles.input}
                onChange={handleImageUrl}
              />
            </div>

            <div className={ModalStyles.formRow}>
              <label className={ModalStyles.label} htmlFor="description">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Add a short description…"
                className={ModalStyles.textarea}
              />
            </div>

            <div className={ModalStyles.formRow}>
              <label className={ModalStyles.label} htmlFor="location">
                Location (optional)
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="City, place…"
                className={ModalStyles.input}
              />
            </div>

            <div className={ModalStyles.actions}>
              <button
                className={ModalStyles.secondaryBtn}
                onClick={handleCloseModal}
                type="button"
              >
                Close
              </button>
              <button
                type="submit"
                className={ModalStyles.primaryBtn}
                disabled={isSubmitting || imageUrl.trim() === ''}
              >
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

export default Profile
