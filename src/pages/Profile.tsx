import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/profile.module.css'
import Modal from '../components/Modal'
import ModalStyles from '../styles/modal.module.css'
import PostTile from '../components/PostTile'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const storedUserId =
    JSON.parse(localStorage.getItem('pixter:user') || 'null')?.id ?? null

  useEffect(() => {
    if (!storedUserId) {
      navigate('/auth')
      return
    }
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${storedUserId}`)
        const data = await res.json()
        if (!ignore) setUser(data)
      } catch (e) {
        console.error(e)
      }
    })()
    return () => {
      ignore = true
    }
  }, [storedUserId, navigate])

  useEffect(() => {
    setIsLoading(true)
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/posts?userId=${storedUserId}`
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
  }, [storedUserId])

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
            {posts.map((post) => (
              <PostTile
                key={post.id}
                id={post.id}
                imageUrl={post.imageUrl}
                description={post.description}
                location={post.location}
              />
            ))}
          </section>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} handleCloseModal={handleCloseModal}>
          <div className={ModalStyles.formRow}>
            <label className={ModalStyles.label} htmlFor="imageUrl">
              Image URL *
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className={ModalStyles.input}
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
            >
              Close
            </button>
            <button className={ModalStyles.primaryBtn}>Add</button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Profile
