import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts, getUser, getAuthHeaders } from '../utils/api'
import Styles from '../styles/profile.module.css'
import Modal from '../components/Modal'
import ModalStyles from '../styles/modal.module.css'
import PostTile from '../components/PostTile'
import { type Post } from '../utils/types'

const Profile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    const newPostBody = {
      imageUrl: formImageUrl,
      description: formDescription || undefined,
    }

    setIsSubmitting(true)

    try {
      const headers = getAuthHeaders()
      const response = await fetch('http://localhost:4000/posts', {
        method: 'POST',
        headers,
        body: JSON.stringify(newPostBody),
      })
      const createdPost = await response.json()
      if (createdPost?.author?.id === user?.id) {
        setPosts((prev) => [createdPost, ...prev])
      } else {
        try {
          const allPosts = await getPosts()
          const mine = Array.isArray(allPosts)
            ? allPosts.filter((p: any) => p.author?.id === user.id)
            : []
          setPosts(mine)
        } catch (reloadErr) {
          console.error(reloadErr)
        }
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
                {user?.createdAt
                  ? `Joined: ${new Date(user.createdAt).toLocaleDateString()}`
                  : null}
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
              posts.map((post) => (
                <PostTile
                  key={post.id}
                  id={post.id}
                  imageUrl={post.imageUrl}
                  description={post.description}
                  location={post.location}
                />
              ))
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
