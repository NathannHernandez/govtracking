import { createSlice } from '@reduxjs/toolkit'
import { fetchBus } from '../../thunks/busThunks'

type Bus = { 
  date: string
  encoded: number
  issues: number
  updated: number
}

type BusState = {
  dailyEncodingData: Bus[]
  loading: boolean
}

const initialState: BusState = { 
  dailyEncodingData: [],
  loading: true
}

const slice = createSlice({
  name: 'bus',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBus.fulfilled, (state, action) => {
        state.dailyEncodingData = action.payload
        state.loading = false
      })
      .addCase(fetchBus.rejected, (state) => {
        state.loading = false
      })
  }
})

export default slice.reducer
