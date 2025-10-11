import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('pixter:user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('pixter:user')
    navigate('/auth')
  }

  return (
    <>
      {user ? (
        <>
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  )
}

export default Profile
