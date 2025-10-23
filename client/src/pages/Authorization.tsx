import { useState } from 'react'
import Login from '../components/Login'
import Registration from '../components/Registration'
import Styles from '../styles/auth.module.css'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo.png'

const Authorization = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  })

  const authDict = {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue',
      switchQuestion: 'Don’t have an account?',
      switchAction: 'Sign up',
    },
    register: {
      title: 'Create your account',
      subtitle: 'Join the community and start sharing',
      switchQuestion: 'Already have an account?',
      switchAction: 'Sign in',
    },
  } as const

  const text = isLogin ? authDict.login : authDict.register

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Fill all the fields')
      }
      setIsLoading(true)

      const submitData = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const res = await submitData.json()
      console.log(res)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const email = userLogin.email.trim().toLowerCase()
      setIsLoading(true)
      const resp = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: userLogin.email.trim().toLowerCase(),
          password: userLogin.password,
        }),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || 'Login failed')
      }
      const { user, token } = await resp.json()
      localStorage.setItem('pixter:auth', JSON.stringify({ user, token }))
      toast.success('You are logged in successfully')
      navigate('/profile')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={Styles.authPage}>
        <div className={Styles.authCard}>
          <div className={Styles.authHeader}>
            <img src={logoUrl} alt="Logo" className={Styles.authLogoImg} />
            <h1 className={Styles.authTitle}>{text.title}</h1>
            <p className={Styles.authSubtitle}>{text.subtitle}</p>
          </div>
          <form
            className={Styles.authForm}
            onSubmit={isLogin ? handleLogin : handleSubmitRegister}
          >
            {isLogin ? (
              <Login
                isLoading={isLoading}
                userLogin={userLogin}
                setUserLogin={setUserLogin}
              />
            ) : (
              <Registration
                userData={userData}
                setUserData={setUserData}
                isLoading={isLoading}
              />
            )}
          </form>

          <div className={Styles.authFooter}>
            <p>
              {text.switchQuestion}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsLogin(!isLogin)
                }}
              >
                {text.switchAction}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Authorization
