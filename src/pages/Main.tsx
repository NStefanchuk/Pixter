import { useEffect, useState } from 'react'
import { getPosts, getUsers } from '../utils/api'
import { type Post, type User } from '../utils/types'

const Main = () => {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const getMainData = async () => {
      const [usersData, postsData] = await Promise.all([getUsers(), getPosts()])
      setUsers(usersData)
      setPosts(postsData)
    }
    getMainData()
  }, [])


  return <div></div>
}

export default Main
