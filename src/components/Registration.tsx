import { useState } from 'react'

const Registration = () => {
  const [userData, setUserData] = useState({
    login: '',
    mail: '',
    password: '',
  })

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  return (
    <form>
      <input type="text" name="login" onChange={handleChangeUserData} />
      <input type="text" name="mail" onChange={handleChangeUserData} />
      <input type="text" name="password" onChange={handleChangeUserData} />
      <button>Register</button>
    </form>
  )
}

export default Registration
