import Styles from '../styles/auth.module.css'

type TLoginProps = {
  userLogin: { email: string; password: string }
  setUserLogin: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >
}

const Login = ({ userLogin, setUserLogin }: TLoginProps) => {
  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserLogin({ ...userLogin, [name]: value })
  }
  return (
    <>
      <input
        className={Styles.authInput}
        placeholder="Email"
        type="text"
        name="email"
        value={userLogin.email}
        onChange={handleChangeUserData}
      />
      <input
        className={Styles.authInput}
        placeholder="Password"
        type="password"
        name="password"
        value={userLogin.password}
        onChange={handleChangeUserData}
      />
      <button className={Styles.authButton}>Login</button>
    </>
  )
}

export default Login
