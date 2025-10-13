import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from '../styles/profile.module.css'
import Modal from '../components/Modal'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
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

  const handleLogout = () => {
    localStorage.removeItem('pixter:user')
    navigate('/auth')
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className={Styles.profilePage}>
        <div className={Styles.profileCard}>
          {user ? (
            <>
              {user.avatarUrl ? (
                <img
                  className={Styles.avatarImg}
                  src={user.avatarUrl}
                  alt={`${user.username} avatar`}
                />
              ) : (
                <div className={Styles.avatarFallback} aria-hidden>
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <p className={Styles.bio}>{user.bio ?? ''}</p>
              <h1>{user.username}</h1>
              <p className={Styles.email}>{user.email}</p>
              <p className={Styles.meta}>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className={Styles.stats}>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user.posts ?? 0}</span>
                  <span className={Styles.statLabel}>Posts</span>
                </div>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user.followers}</span>
                  <span className={Styles.statLabel}>Followers</span>
                </div>
                <div className={Styles.stat}>
                  <span className={Styles.statValue}>{user.following}</span>
                  <span className={Styles.statLabel}>Following</span>
                </div>
              </div>
              <button className={Styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
              <button className={Styles.logoutBtn} onClick={handleOpenModal}>
                Add new post
              </button>
            </>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen}>
          <p>Pls upload your picture</p>
          <input type="text" name="pictureURL" />
          <input type="text" name="Title" />
          <input type="text" name="Description" />
          <button>Add</button>
          <button>Close</button>
        </Modal>
      )}
    </>
  )
}

export default Profile
