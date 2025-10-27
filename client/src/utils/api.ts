export type CreateCommentPayload = {
  postId: string
  content: string
}

export type CreatePostPayload = {
  imageUrl: string
  description?: string
}

export function getAuthHeaders() {
  const authData = localStorage.getItem('pixter:auth')
  if (!authData) {
    return {
      'Content-Type': 'application/json',
    }
  }

  try {
    const { token } = JSON.parse(authData)
    if (!token) {
      return {
        'Content-Type': 'application/json',
      }
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  } catch {
    return {
      'Content-Type': 'application/json',
    }
  }
}

export const getUser = async () => {
  const headers = getAuthHeaders()
  const res = await fetch('http://localhost:4000/users/me', { headers })
  if (!res.ok) throw new Error('Failed to fetch current user')
  return await res.json()
}

export const getPosts = async () => {
  const res = await fetch('http://localhost:4000/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return await res.json()
}

export const getComments = async () => {
  const res = await fetch('http://localhost:4000/comments')
  if (!res.ok) throw new Error('Failed to fetch comments')
  return await res.json()
}

export const createComment = async (payload: CreateCommentPayload) => {
  const headers = getAuthHeaders()
  const res = await fetch('http://localhost:4000/comments', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create comment')
  return await res.json()
}

export const createPost = async (payload: CreatePostPayload) => {
  const headers = getAuthHeaders()
  const res = await fetch('http://localhost:4000/posts', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create post')
  return await res.json()
}
