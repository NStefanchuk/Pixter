export type Post = {
  id: string
  imageUrl: string
  userId: string
  description?: string
  location?: string
  createdAt?: string
}

export type User = {
  id: string
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
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
}

export interface NewComment {
  postId: string
  userId: string
  content: string
  createdAt: string
}
