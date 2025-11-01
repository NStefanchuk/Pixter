export type Post = {
  id: string
  authorId: string
  imageUrl: string
  description: string
  createdAt: string
  updatedAt: string
  likeCount: number
  commentCount: number
  author: {
    id: string
    username: string
    avatarUrl: string
  }
}


export type User = {
  id: string
  username: string
  email: string
  createdAt: string
  bio?: string
  followersCount: number
  followingCount: number
  postsCount: number
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
  content: string
}
