import { useState } from 'react'

const Registration = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Fill all the fields')
      }
      setIsLoading(true)
      const email = userData.email.trim().toLowerCase()

      const getData = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(
          email
        )}&_limit=1`
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

  return (
    <form onSubmit={handleSubmitRegister}>
      <input type="text" name="username" onChange={handleChangeUserData} />
      <input type="text" name="email" onChange={handleChangeUserData} />
      <input type="password" name="password" onChange={handleChangeUserData} />
      <button disabled={isLoading}>Register</button>
    </form>
  )
}

export default Registration
