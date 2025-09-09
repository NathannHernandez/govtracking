import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchBus = createAsyncThunk(
  'bus/fetchBus',
  async ({ userId, days }: { userId: string; days: string }) => {
    const res = await fetch(`http://localhost:3001/v1/bus/allEncoded?userId=${userId}&days=${days}`, {
      method: 'GET',
      credentials: 'include',
    })

    return await res.json()
  }
)
