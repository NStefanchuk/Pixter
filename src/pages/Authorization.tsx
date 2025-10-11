import { useState } from 'react'
import Login from '../components/Login'
import Registration from '../components/Registration'
import Styles from '../styles/auth.module.css'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
      title: 'Create your Pixter account',
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
      const email = userData.email.trim().toLowerCase()

      const getData = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(email)}`
      )
      const user = await getData.json()
      if (user.length > 0) {
        toast.error('Email is already exist')
        return
      }
      const newUser = {
        ...userData,
        email,
        createdAt: new Date().toISOString(),
      }
      const submitData = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
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
      const getUser = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(email)}`
      )
      const user = await getUser.json()
      if (user.length === 0) {
        toast.error('User doesn’t exist')
        return
      }
      const password = userLogin.password
      if (password === user[0].password) {
        const { id, username, email, createdAt } = user[0]
        localStorage.setItem(
          'pixter:user',
          JSON.stringify({ id, username, email, createdAt })
        )
        toast.success('You are logged in successfully')
        navigate('/profile')
      } else {
        toast.error('Wrong password')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={Styles.authPage}>
        <div className={Styles.authCard}>
          <div className={Styles.authHeader}>
            <div className={Styles.authLogo} />
            <h1 className={Styles.authTitle}>{text.title}</h1>
            <p className={Styles.authSubtitle}>{text.subtitle}</p>
          </div>
          <form
            className={Styles.authForm}
            onSubmit={isLogin ? handleLogin : handleSubmitRegister}
          >
            {isLogin ? (
              <Login userLogin={userLogin} setUserLogin={setUserLogin} />
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
