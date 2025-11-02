import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../slices/user/userSlice'
import postsSlice from '../slices/posts/postsSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
