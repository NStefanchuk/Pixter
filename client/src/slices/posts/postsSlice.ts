import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from '../../utils/types'

type TPostsState = {
  items: Post[]
  isLoading: boolean
  postsSliceError: string | null
}

const initialState: TPostsState = {
  items: [],
  isLoading: false,
  postsSliceError: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.items = action.payload
    },
    removePost(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    updatePost(state, action: PayloadAction<Post>) {
      state.items = state.items.map((p) =>
        p.id === action.payload.id ? action.payload : p
      )
    },
  },
})

export const { setPosts, removePost, updatePost } = postsSlice.actions

export default postsSlice.reducer
