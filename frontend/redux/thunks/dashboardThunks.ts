import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchDashboard = createAsyncThunk(
  'bus/fetchDashboard',
  async ({ userId, days }: { userId: string; days: string }) => {
    const res = await fetch(`http://localhost:3001/v1/encoded/count?userId=${userId}&days=${days}`, {
      method: 'GET',
      credentials: 'include',
    })

    return await res.json()
  }
)
