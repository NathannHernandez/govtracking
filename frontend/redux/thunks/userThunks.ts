import { createAsyncThunk } from '@reduxjs/toolkit'

type UserState = {
  userId: string
  username: string
  email: string
  role: string
  csrf: string
  access_token: string
  loading: boolean
} 


export const fetchUser = createAsyncThunk<UserState>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/v1/auth/check-auth`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Unauthorized')


      const data: UserState = await res.json()
      return data
    } catch (err) {
      return rejectWithValue('Network error')
    }
  }
)
