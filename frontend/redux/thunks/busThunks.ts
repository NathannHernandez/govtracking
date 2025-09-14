import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchBus = createAsyncThunk(
  'bus/fetchBus',
  async ({ userId, days }: { userId: string; days: string }) => {
    const res = await fetch(`http://localhost:3001/v1/encoded/count?userId=${userId}&days=${days}`, {
      method: 'GET',
      credentials: 'include',
    })

    return await res.json()
  }
)


export const fetchRecentBus = createAsyncThunk(
  'bus/fetctRecentBus',
  async ({ userId }: { userId: string }) => {
    console.log("HEllo")
    const res = await fetch(`http://localhost:3001/v1/bus/recent?id=${userId}`, {
      method: 'GET',
      credentials: 'include',
    })

    return await res.json()
  }
)
