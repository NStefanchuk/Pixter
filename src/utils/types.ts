export type Post = {
  id: number | string
  imageUrl: string
  description?: string
  location?: string
  createdAt?: string
}

export type User = {
  id: number | string
  username: string
  email: string
  password: string
  createdAt: string
  followers: number
  following: number
  posts: number
  avatarUrl?: string
}

export type Comment = {
  id: number | string
  postId: number | string
  userId: number | string
  content: string
  createdAt: string
}
