import { createSlice } from '@reduxjs/toolkit'
import { fetchUserData } from '../user/userApi'
import { User } from '../../utils/types'

type TUserState = {
  userData: null | User
  isLoading: boolean
  userSliceError: null | string
}

const initialState: TUserState = {
  userData: null,
  isLoading: false,
  userSliceError: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true
        state.userSliceError = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false
        state.userData = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false
        state.userSliceError =
          action.error.message || 'Failed to fetch user data'
      })
  },
})

export default userSlice.reducer
