// redux/thunks/userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    const res = await fetch('http://localhost:3001/v1/auth/check-auth', {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) {
      return rejectWithValue('Unauthorized')
    }

    return await res.json()
  }
)
