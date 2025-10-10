import { useState } from 'react'
import Login from '../components/Login'
import Registration from '../components/Registration'
import Styles from '../styles/auth.module.css'

const Authorization = () => {
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
      console.log(user.length)
      if (user.length > 0) {
        alert('email is already exist')
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

//   const handleLogin = async () => {
//     try {

//       const getData = await fetch(
//         `http://localhost:3000/users?email=${encodeURIComponent(email)}`
//       )
//     } catch (error) {}
//   }

  return (
    <>
      <div className={Styles.authPage}>
        <div className={Styles.authCard}>
          <div className={Styles.authHeader}>
            <div className={Styles.authLogo} />
            <h1 className={Styles.authTitle}>Create your Pixter account</h1>
            <p className={Styles.authSubtitle}>
              Join the community and start sharing
            </p>
          </div>
          <form
            className={Styles.authForm}
            onSubmit={!isLogin ? handleSubmitRegister : undefined}
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
              Already have an account?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsLogin(!isLogin)
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Authorization
