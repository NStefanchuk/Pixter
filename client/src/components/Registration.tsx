import Styles from '../styles/auth.module.css'

type TRegistrationProps = {
  userData: { username: string; email: string; password: string }
  setUserData: React.Dispatch<
    React.SetStateAction<{ username: string; email: string; password: string }>
  >
  isLoading: boolean
}

const Registration = ({
  userData,
  setUserData,
  isLoading,
}: TRegistrationProps) => {
  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  return (
    <>
      <input
        className={Styles.authInput}
        placeholder="Username"
        type="text"
        name="username"
        value={userData.username}
        onChange={handleChangeUserData}
      />
      <input
        className={Styles.authInput}
        placeholder="Email"
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChangeUserData}
      />
      <input
        className={Styles.authInput}
        placeholder="Password"
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChangeUserData}
      />
      <button className={Styles.authButton} type="submit" disabled={isLoading}>
        {isLoading ? 'Loading…' : 'Register'}
      </button>
    </>
  )
}

export default Registration
