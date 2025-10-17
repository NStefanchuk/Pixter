export interface Post {
  id: number | string
  imageUrl: string
  description?: string
  location?: string
  createdAt?: string
}

export interface User {
  id: number | string
  username: string
  email: string
  password: string
  createdAt: string
  followers: number
  following: number
  posts: number
}
