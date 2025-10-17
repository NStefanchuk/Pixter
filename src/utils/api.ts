export const STORED_USER_ID =
  JSON.parse(localStorage.getItem('pixter:user') || 'null')?.id ?? null

export const getUsers = async () => {
  try {
    const res = await fetch(`http://localhost:3000/users`)
    const data = await res.json()
    return data
  } catch (e) {
    console.error(e)
  }
}

export const getUser = async () => {
  try {
    const res = await fetch(`http://localhost:3000/users/${STORED_USER_ID}`)
    const data = await res.json()
    return data
  } catch (e) {
    console.error(e)
  }
}

export const getPosts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/posts`)
    const data = await res.json()
    return data
  } catch (e) {
    console.error(e)
  }
}
