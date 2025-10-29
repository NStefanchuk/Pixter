import { createAsyncThunk } from '@reduxjs/toolkit'
const API_URL = import.meta.env.VITE_BACKEND_URL as string

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('pixter:auth') || '').token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
)
